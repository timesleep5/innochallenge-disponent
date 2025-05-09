import {Injectable} from '@angular/core';
import {ConnectorService} from './connector.service';
import {RouteResponse} from '../datatype/RouteResponse';
import {Observable} from 'rxjs';
import {Trip} from '../datatype/Trip';

@Injectable({
    providedIn: 'root'
})
export class HelperApiService {

    constructor(
        private connectorService: ConnectorService
    ) {
        this.connectorService.setUrl('http://korbi-der-huan:8000/')
    }

    public getRoutsFromTrips(trips: Trip[]): Observable<RouteResponse> {
        return this.connectorService.put(
            "getRouteFromTrips",
            {trips}
        );
    }
}
