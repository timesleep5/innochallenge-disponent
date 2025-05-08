import { AfterViewInit, Component } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-leaflet-test',
  imports: [],
  templateUrl: './leaflet-test.component.html',
  styleUrl: './leaflet-test.component.css'
})
export class LeafletTestComponent implements AfterViewInit {

    private map: L.Map | undefined;

    ngAfterViewInit(): void {
      this.initMap();
        // const map = L.map('map').setView([51.505, -0.09],13);
        // L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        //   attribution: '&copy; OpenStreetMap contributors'
        // }).addTo(map);
    }

    private initMap(): void {
      this.map = L.map('map').setView([51.505, -0.09], 13); // Example: Eiffel Tower
  
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(this.map);
  
      L.marker([51.505, -0.09])
        .addTo(this.map)
        .bindPopup('Eiffel Tower')
        .openPopup();
    }
}
