import { AfterViewInit, Component } from '@angular/core';
import * as L from 'leaflet';
import { Transport } from '../../shared/datatype/Transport';
import { HttpClient } from '@angular/common/http';
import { RouteVisualization } from '../../shared/datatype/RouteVisualization';
import { Observable } from 'rxjs';
import type { Feature, LineString } from 'geojson';

@Component({
  selector: 'app-leaflet-test',
  imports: [],
  templateUrl: './leaflet-test.component.html',
  styleUrl: './leaflet-test.component.css'
})
export class LeafletTestComponent implements AfterViewInit {


  private map: L.Map | undefined;

  constructor(private http: HttpClient) { }

  ngAfterViewInit(): void {
    this.initMap();

    // call api to load list of drivers 
    let transports: Transport[] = [];
    // wait for selection change
    let driverId = "D05";
    // filter list of locations for selected driver
    let driversTransports: Transport[] = transports.filter(transport =>
      transport.driverId.includes(driverId)); // TODO why is drivers a list in transport

    let locations = driversTransports.map(t => ({
      startLocationId: Number(t.startLocationId),
      endLocationId: Number(t.endLocationId)
    }));

    locations = [{ startLocationId: 89, endLocationId: 261 }]

    // request pin coordinates and stuff from backend
    this.requestRouteDetails(locations).subscribe({
      next: (routePlanning: RouteVisualization) => {
        console.log('Route planning data:', routePlanning);

        // plot the coordinates in the map
        this.plotRouteDetails(routePlanning);
      },
      error: (err) => {
        console.error('Failed to fetch map details', err);
        return;
      }
    });

  }

  private requestRouteDetails(locations: { startLocationId: Number, endLocationId: Number }[]): Observable<RouteVisualization> {
    const url = 'http://localhost:8000/v1/trip/geo';

    const body = { trips: locations };
    console.log(locations);

    return this.http.put<RouteVisualization>(url, body);
  }

  private plotRouteDetails(routeDetails: RouteVisualization): void {
    for (let pin of routeDetails.pins) {
      L.marker([pin.latitude, pin.longitude]).
        addTo(this.map!)
        .bindPopup(""); // TODO Add Details
    }
    const route = L.geoJSON(routeDetails.route as GeoJSON.GeoJsonObject, {
      style: { color: 'blue', weight: 4 }
    }).addTo(this.map!);

    this.map!.fitBounds(route.getBounds());
  }

  private initMap(): void {
    this.map = L.map('map').setView([48.8584, 2.2945], 5); // Example: Eiffel Tower

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    L.marker([52.5200, 13.4050])
      .addTo(this.map)
      .bindPopup('Eiffel Tower')
      .openPopup();

    L.marker([48.1351, 11.5820])
      .addTo(this.map)
      .bindPopup('Tower Bridge')
      .openPopup();
    let token = "5b3ce3597851110001cf62486a2a1595359f4e529edaaabd04ba2b0d";
    const url = 'https://api.openrouteservice.org/v2/directions/driving-hgv/geojson';
    let body = {
      "coordinates": [
        [13.4050, 52.5200],  // Berlin [lng, lat]
        [11.5820, 48.1351]   // Munich [lng, lat]
      ]
    }

    fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
      .then(res => res.json())
      .then(geojson => {
        const route = L.geoJSON(geojson, {
          style: { color: 'blue', weight: 4 }
        }).addTo(this.map!);
        console.log(geojson);

        this.map!.fitBounds(route.getBounds());
      })
      .catch(err => console.error('ORS Routing error:', err));
  }
}
