import {Injectable} from '@angular/core';
import {ConnectorService} from './connector.service';
import {Observable} from 'rxjs';
import {OptimizeResponse} from '../datatype/OptimizeResponse';

@Injectable({
    providedIn: 'root'
})
export class RouteService {

    constructor(
        private connectorService: ConnectorService
    ) {
    }

    public optimizeRoute(): Observable<OptimizeResponse> {
        return this.connectorService.optimizeCall(
            "optimize",
            {'optimizationGoal': 'TRAVEL_DISTANCE', 'optimizationAlgorithm': 'SIMPLE_GREEDY_VRP_OPTIMIZER'}
        );
    }

    public getSth(): Observable<any> {
        return this.connectorService.get(
            "trucks"
        );
    }
}
