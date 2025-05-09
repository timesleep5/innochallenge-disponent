import {Injectable} from '@angular/core';
import {ConnectorService} from './connector.service';
import {RouteResponse} from '../datatype/RouteResponse';
import {Observable} from 'rxjs';
import {Trip} from '../datatype/Trip';

@Injectable({
    providedIn: 'root'
})
export class HelperApiService {
    private urlPrefix: string = "";

    constructor(
        private connectorService: ConnectorService
    ) {
        this.urlPrefix = 'http://127.0.0.1:8000/v1/';
    }

    public getRoutsFromTrips(trips: Trip[]): Observable<RouteResponse> {
        return this.connectorService.put(
            `${this.urlPrefix}trip/geo`,
            {trips}
        );
    }
}
