import {AfterViewInit, Component, HostBinding, OnDestroy} from '@angular/core';
import {Transport} from '../../shared/datatype/Transport';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {interval, Subscription} from 'rxjs';
import {TruckDriver} from '../../shared/datatype/TruckDriver';
import {LocationAddress} from '../../shared/datatype/LocationAddress';

import * as L from 'leaflet';
import {MockApiService} from '../../shared/api/mock-api.service';
import {HelperApiService} from '../../shared/api/helper-api.service';

@Component({
    selector: 'app-main',
    imports: [
        NgClass,
        NgForOf,
        FormsModule,
        NgIf
    ],
    templateUrl: './main.component.html',
    styleUrl: './main.component.css'
})
export class MainComponent implements OnDestroy, AfterViewInit {
    protected changes: number = 0;
    protected transports: Transport[] = [];
    protected filteredTransports: Transport[] = [];
    protected filteredTransport: Transport | undefined;
    protected truckDrivers: TruckDriver[] = [];
    protected selectedTruckDriver: TruckDriver | undefined;
    protected startLocation: LocationAddress | undefined;
    protected endLocation: LocationAddress | undefined;
    private locationAddresses: LocationAddress[] = [];
    private randomChangeSubscription: Subscription | null = null;

    private map: L.Map | undefined;

    constructor(
        private mockService: MockApiService,
        private helperApiService: HelperApiService
    ) {
    }

    @HostBinding('style.--animation-duration')
    get animationDuration(): string {
        return `${5000 / this.changes}ms`;
    }

    ngOnInit() {
        this.mockService.getChanges().subscribe((changes) => {
            this.changes = changes;
        });
        this.mockService.optimizeRoute().subscribe((response) => {
            this.transports = response.transportPlan.transports.sort(
                (a, b) => a.startDateTime.localeCompare(b.startDateTime)
            );
        });
        this.mockService.getDrivers().subscribe((response) => {
            this.truckDrivers = response.sort(
                (a, b) => a.lastName.localeCompare(b.lastName)
            );
        });
        this.mockService.getLocationAddress().subscribe((response) => {
            this.locationAddresses = response;
        });
        this.startRandomChangeIncrement();
    }

    ngOnDestroy() {
        if (this.randomChangeSubscription) {
            this.randomChangeSubscription.unsubscribe();
        }
    }

    ngAfterViewInit(): void {
        this.initMap();
    }

    private updateRoute() {
        if (!this.transports) {
            return;
        }

        this.helperApiService.getRoutsFromTrips(this.transports.map(transport => ({
            startLocationId: Number(transport.startLocationId),
            endLocationId: Number(transport.endLocationId)
        }))).subscribe((response) => {
            // @ts-ignore TODO check if ok
            const route = L.geoJson(response, {
                style: {color: 'blue', weight: 4}
            }).addTo(this.map!);

            this.map!.fitBounds(route.getBounds());
        });
    }

    protected onClick() {
        this.mockService.optimizeRoute().subscribe((response) => {
            this.transports = response.transportPlan.transports;

            if (this.selectedTruckDriver) {
                this.onSelectTruckDriver();
            }

            this.updateRoute();
        });

        this.changes = 0;
    }

    protected onSelectTruckDriver() {
        const selectedDriverId = this.selectedTruckDriver!.driverId;
        this.filteredTransport = this.transports.find(transport =>
            transport.driverId.includes(selectedDriverId)
        );

        this.filteredTransports = this.transports.filter(transport =>
            transport.driverId.includes(selectedDriverId));

        if (this.filteredTransport) {
            this.startLocation = this.locationAddresses.find(location =>
                location.locationId === this.filteredTransport!.startLocationId
            );
            this.endLocation = this.locationAddresses.find(location =>
                location.locationId === this.filteredTransport!.endLocationId
            );

            this.updateRoute();
        } else {
            this.startLocation = undefined;
            this.endLocation = undefined;
        }
    }

    private startRandomChangeIncrement() {
        this.randomChangeSubscription = interval(200).subscribe(() => {
            if (Math.random() < .05) {
                this.changes += Math.floor(Math.random() * 2);
            }
        });
    }

    private initMap(): void {
        this.map = L.map('map').setView([48.8584, 2.2945], 5);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(this.map);

        const token = "5b3ce3597851110001cf62486a2a1595359f4e529edaaabd04ba2b0d";
        const url = 'https://api.openrouteservice.org/v2/directions/driving-hgv/geojson';
        let body = {
            "coordinates": [
                [13.4050, 52.5200],  // Berlin [lng, lat]
                [11.5820, 48.1351]   // Munich [lng, lat]
            ]
        }
    }
}
