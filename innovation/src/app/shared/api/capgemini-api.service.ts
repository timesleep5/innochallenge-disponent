import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {OptimizeResponse} from '../datatype/OptimizeResponse';
import {LocationAddress} from '../datatype/LocationAddress';
import {ConnectorService} from './connector.service';
import {TruckDriver} from '../datatype/TruckDriver';

@Injectable({
    providedIn: 'root'
})
export class CapgeminiApiService {

    constructor(
        private connectorService: ConnectorService
    ) {
        this.connectorService.setUrl('https://optimaloptimizer.thankfulbeach-22a876ac.westus2.azurecontainerapps.io/' + 'api/v1/')
    }

    public optimizeRoute(): Observable<OptimizeResponse> {
        return this.connectorService.add(
            "optimize",
            {'optimizationGoal': 'TRAVEL_DISTANCE', 'optimizationAlgorithm': 'SIMPLE_GREEDY_VRP_OPTIMIZER'}
        );
    }

    public getDrivers(): Observable<TruckDriver[]> {
        return this.connectorService.get(
            "truck-drivers"
        );
    }

    public getLocationAddress(): Observable<LocationAddress[]> {
        return this.connectorService.get("location-addresses");
    }
}
