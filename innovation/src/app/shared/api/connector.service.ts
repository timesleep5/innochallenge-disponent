import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {OptimizeResponse} from '../datatype/OptimizeResponse';

@Injectable({
    providedIn: 'root'
})
export class ConnectorService {
    private url = 'https://optimaloptimizer.thankfulbeach-22a876ac.westus2.azurecontainerapps.io/' + 'api/v1/';

    constructor(
        private http: HttpClient
    ) {
    }

    optimizeCall(suffix: string, body: any): Observable<any> {
        return this.http.post(
            'https://optimaloptimizer.thankfulbeach-22a876ac.westus2.azurecontainerapps.io/api/v1/optimize',
            {'optimizationGoal': 'TRAVEL_DISTANCE', 'optimizationAlgorithm': 'SIMPLE_GREEDY_VRP_OPTIMIZER'},
            {headers: new HttpHeaders().set('accept', '*/*').set('Content-Type', 'application/json')}
        );
    }

    optimizeMock(): Observable<OptimizeResponse> {
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

    add(suffix: string, body: any): Observable<any> {
        return this.http.post(
            `${this.url}${suffix}`, body,
            {headers: this.buildSendHeader()}
        );
    }

    get(suffix: string): Observable<any> {
        return this.http.get(
            `${this.url}${suffix}`,
            {headers: this.buildRequestHeader()}
        );
    }

    update(suffix: string, body: any): Observable<any> {
        return this.http.patch(
            `${this.url}${suffix}`, body,
            {headers: this.buildSendHeader()}
        );
    }

    delete(suffix: string): Observable<any> {
        return this.http.delete(
            `${this.url}${suffix}`,
            {headers: this.buildDeleteHeader()}
        );
    }

    private buildDeleteHeader() {
        return new HttpHeaders().set('accept', '*/*')
    }

    private buildRequestHeader() {
        return new HttpHeaders().set('accept', 'application/json')
    }

    private buildSendHeader() {
        return this.buildRequestHeader().set('Content-Type', 'application/json');
    }
}
