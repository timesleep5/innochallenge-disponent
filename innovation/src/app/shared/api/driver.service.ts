import {Injectable} from '@angular/core';
import {ConnectorService} from './connector.service';
import {Observable, of} from 'rxjs';
import {TruckDriver} from '../datatype/TruckDriver';

@Injectable({
    providedIn: 'root'
})
export class DriverService {

    constructor(
        private connectorService: ConnectorService
    ) {
    }

    public getDrivers(): Observable<TruckDriver[]> {
        return this.connectorService.get(
            "truck-drivers"
        );
    }

    public mockGetDrivers(): Observable<TruckDriver[]> {
        return of(
            [
                {
                    "driverId": "D01",
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
                    "driverId": "D05",
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
                }
            ]
        )
    }
}
