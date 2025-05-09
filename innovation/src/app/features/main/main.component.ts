import {AfterViewInit, Component, HostBinding, OnDestroy} from '@angular/core';
import {Transport} from '../../shared/datatype/Transport';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {interval, Subscription} from 'rxjs';
import {TruckDriver} from '../../shared/datatype/TruckDriver';
import {LocationAddress} from '../../shared/datatype/LocationAddress';
import {RouteVisualization} from '../../shared/datatype/RouteVisualization';
import {HttpClient} from '@angular/common/http';

import * as L from 'leaflet';
import {GeoJSON} from 'leaflet';
import {MockApiService} from '../../shared/api/mock-api.service';
import {HelperApiService} from '../../shared/api/helper-api.service';
import {CapgeminiApiService} from '../../shared/api/capgemini-api.service';


const customIcon = L.icon({
    iconUrl: '/location_on.png',
    iconSize: [35, 35],
    iconAnchor: [18, 35],
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
    protected error: boolean = false;
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
    private layers: L.Layer[] = [];

    constructor(
        private helperApiService: HelperApiService,
        private http: HttpClient,
        private mockApiService: MockApiService,
        private apiService: CapgeminiApiService,
    ) {
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
        this.error = false;
        this.clearMap();
        this.removeMarkers();
        if (!this.filteredTransports) {
            return;
        }

        this.helperApiService.getRoutesFromTrips(this.filteredTransports.map(transport => ({
            startLocationId: Number(transport.startLocationId),
            endLocationId: Number(transport.endLocationId)
        }))).subscribe((routePlanning: RouteVisualization) => {
            if (routePlanning.pins.length === 0) {
                return;
            }
            if (routePlanning.route && (routePlanning.route as any).error) {
                console.log('Error in route planning:', (routePlanning.route as any).error);
                this.error = true;
                return;
            }

            this.plotRouteDetails(routePlanning);
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
                location.locationId == this.filteredTransport!.startLocationId
            );
            this.endLocation = this.locationAddresses.find(location =>
                location.locationId == this.filteredTransport!.endLocationId
            );
        } else {
            this.startLocation = undefined;
            this.endLocation = undefined;
        }

        this.updateRoute();
    }

    private plotRouteDetails(routeDetails: RouteVisualization): void {
        let counter = 0;
        for (let pin of routeDetails.pins) {
            counter++;
            this.initMarker(this.locationAddresses.find(location => Number(location.locationId) == pin.startLocationId), [pin.latitude, pin.longitude], counter);
        }

        const route = L.geoJSON(routeDetails.route as GeoJSON.GeoJsonObject, {
            style: {color: 'blue', weight: 4}
        }).addTo(this.map!);

        this.layers.push(route);

        this.map!.fitBounds(route.getBounds());
    }

    private startRandomChangeIncrement() {
        this.randomChangeSubscription = interval(1000).subscribe(() => {
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

    private initMarker(location: LocationAddress | undefined, coordinates: L.LatLngExpression, stopNr: number): void {
        let popupContent =
            `<div class="popup-content">
                <h3>Location Details</h3>
                <p><b>Stop Nr:</b> ${stopNr}</p>
                <p><b>Country:</b> ${location?.country}</p>
                <p><b>Area code:</b> ${location?.areaCode}</p>
                <p><b>City:</b> ${location?.city}</p>
                <p><b>Address:</b> ${location?.address}</p>
            </div>`;

        if (this.map) {
            console.log(location)
            if (location) {
                let marker = L.marker(coordinates, {icon: customIcon})
                marker
                    .addTo(this.map)
                    .bindPopup(popupContent)

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

    private clearMap(): void {
        this.layers.forEach(layer => {
            this.map?.removeLayer(layer);
        });
        this.layers = [];
    }
}
