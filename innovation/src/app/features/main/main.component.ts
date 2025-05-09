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
import {latLng} from 'leaflet';
import {CapgeminiApiService} from '../../shared/api/capgemini-api.service';


const customIcon = L.icon({
    iconUrl: '/location_on.png',
    iconSize: [30, 30],
    iconAnchor: [15, 40],
    popupAnchor: [0, -35]
});

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
    private markers: L.Marker[] = [];




    constructor(
        private mockApiService: MockApiService,
        private apiService: CapgeminiApiService,
        private helperApiService: HelperApiService
    ) {
    }

    @HostBinding('style.--animation-duration')
    get animationDuration(): string {
        return `${5000 / this.changes}ms`;
    }

    ngOnInit() {
        this.mockApiService.getChanges().subscribe((changes) => {
            this.changes = changes;
        });
        this.apiService.getRoute().subscribe((response) => {
            this.transports = response.transportPlan.transports.sort(
                (a, b) => a.startDateTime.localeCompare(b.startDateTime)
            );
        });
        this.apiService.getDrivers().subscribe((response) => {
            this.truckDrivers = response.sort(
                (a, b) => a.lastName.localeCompare(b.lastName)
            );
        });
        this.apiService.getLocationAddress().subscribe((response) => {
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
        this.apiService.optimizeRoute().subscribe((response) => {
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

        let startCoordinates = latLng(40.7128, -74.0060);
        let endCoordinates = latLng(34.0522, -118.2437);

        this.initMarker(this.startLocation, startCoordinates);
        this.initMarker(this.endLocation, endCoordinates);
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

    private initMarker(location: LocationAddress | undefined, coordinates: L.LatLngExpression): void {
        let popupContent =
            `<div class="popup-content">
                <h3>Location Details</h3>
                <p><b>Country:</b> ${location?.country}</p>
                <p><b>Area code:</b> ${location?.areaCode}</p>
                <p><b>City:</b> ${location?.city}</p>
                <p><b>Address:</b> ${location?.address}</p>
            </div>`;

        if (this.map) {
            if (location) {
                let marker = L.marker(coordinates, {icon: customIcon})
                marker
                    .addTo(this.map)
                    .bindPopup(popupContent)
                    .openPopup()

                this.markers.push(marker);
            } else {
                this.removeMarkers()
            }
        }
    }
    private removeMarkers(): void {
        this.markers.forEach(marker => {
            this.map?.removeLayer(marker);
        });
        this.markers = [];
    }
}
