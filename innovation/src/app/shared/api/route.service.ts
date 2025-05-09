import {Injectable} from '@angular/core';
import {ConnectorService} from './connector.service';
import {Observable, of} from 'rxjs';
import {OptimizeResponse} from '../datatype/OptimizeResponse';
import {LocationAddress} from '../datatype/LocationAddress';

@Injectable({
    providedIn: 'root'
})
export class RouteService {

    constructor(
        private connectorService: ConnectorService
    ) {
    }

    public optimizeRoute(): Observable<OptimizeResponse> {
        return this.connectorService.add(
            "optimize",
            {'optimizationGoal': 'TRAVEL_DISTANCE', 'optimizationAlgorithm': 'SIMPLE_GREEDY_VRP_OPTIMIZER'}
        );
    }

    public getLocationAddress(): Observable<LocationAddress[]> {
        return this.connectorService.get("location-addresses");
    }

    public mockGetLocationAddress(): Observable<LocationAddress[]> {
        return of([
            {
                "locationId": "89",
                "name": "Müller GmbH",
                "address": "Eichenstraße 33",
                "areaCode": "71063",
                "city": "Sindelfingen",
                "country": "DEU"
            },
            {
                "locationId": "34",
                "name": "Maxidax AG",
                "address": "Am Moorloch 33",
                "areaCode": "78166",
                "city": "Donaueschingen",
                "country": "DEU"
            }
        ])
    }

    public mockOptimizeRoute(): Observable<OptimizeResponse> {
        return of({
            "solutionOverview": {
                "optimizationAlgorithm": "SIMPLE_GREEDY_VRP_OPTIMIZER",
                "optimizationGoal": "TRAVEL_TIME",
                "solutionStatus": "UNKNOWN",
                "numberOfUsedDrivers": 26,
                "travelDistance": 47204.897629820385,
                "travelTime": 49713.0
            },
            "transportPlan": {
                "transports": [
                    {
                        "driverId": [
                            "D20",
                            "D10"
                        ],
                        "truckId": "TK18",
                        "startLocationId": "1000001",
                        "endLocationId": "2005089",
                        "startDateTime": "2025-04-01T06:30:00",
                        "endDateTime": "2025-04-01T09:36:00",
                        "trailerId": "TR23",
                        "deliveries": [
                            "R56",
                            "R52"
                        ]
                    },
                    {
                        "driverId": [
                            "D20"
                        ],
                        "truckId": "TK18",
                        "startLocationId": "2005089",
                        "endLocationId": "2002933",
                        "startDateTime": "2025-04-01T09:36:00",
                        "endDateTime": "2025-04-01T14:57:00",
                        "trailerId": "TR23",
                        "deliveries": [
                            "R56",
                            "R52"
                        ]
                    }
                ]
            }
        });
    }
}
