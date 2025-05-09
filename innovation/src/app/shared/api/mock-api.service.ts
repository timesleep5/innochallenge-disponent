import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {OptimizeResponse} from '../datatype/OptimizeResponse';
import {LocationAddress} from '../datatype/LocationAddress';
import {TruckDriver} from '../datatype/TruckDriver';

@Injectable({
    providedIn: 'root'
})
export class MockApiService {

    constructor() {
    }

    public getChanges(): Observable<any> {
        return of(6);
    }

    public optimizeRoute(): Observable<OptimizeResponse> {
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
                        "startLocationId": "89",
                        "endLocationId": "34",
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
                        "startLocationId": "34",
                        "endLocationId": "89",
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

    public getDrivers(): Observable<TruckDriver[]> {
        return of(
            [
                {
                    "driverId": "D10",
                    "firstName": "Noah",
                    "lastName": "Müller",
                    "mnemonic": "NOMÜ",
                    "craneLicenseOwner": true,
                    "forkliftLicenseOwner": true,
                    "longTruckLicenseOwner": true,
                    "eurotrailerLicenseOwner": true,
                    "adrLicenseOwner": true,
                    "currentLocation": "1000001",
                    "homeBase": "1000001"
                },
                {
                    "driverId": "D20",
                    "firstName": "Lukas",
                    "lastName": "Kraftfahrer",
                    "mnemonic": "LUKR",
                    "craneLicenseOwner": false,
                    "forkliftLicenseOwner": false,
                    "longTruckLicenseOwner": false,
                    "eurotrailerLicenseOwner": false,
                    "adrLicenseOwner": false,
                    "currentLocation": "1000002",
                    "homeBase": "1000002"
                },
                {
                    "driverId": "D00",
                    "firstName": "Schaffi",
                    "lastName": "Schaffnix",
                    "mnemonic": "SCSC",
                    "craneLicenseOwner": false,
                    "forkliftLicenseOwner": false,
                    "longTruckLicenseOwner": false,
                    "eurotrailerLicenseOwner": false,
                    "adrLicenseOwner": false,
                    "currentLocation": "1000006",
                    "homeBase": "1000006"
                }
            ]
        )
    }

    public getLocationAddress(): Observable<LocationAddress[]> {
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
}
