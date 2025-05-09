import {Component, HostBinding, OnDestroy} from '@angular/core';
import {RouteService} from '../../shared/api/route.service';
import {ChangeService} from '../../shared/api/change.service';
import {Transport} from '../../shared/datatype/Transport';
import {NgClass, NgForOf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {interval, Subscription} from 'rxjs';
import {DriverService} from '../../shared/api/driver.service';
import {TruckDriver} from '../../shared/datatype/TruckDriver';
import {LocationAddress} from '../../shared/datatype/LocationAddress';

@Component({
    selector: 'app-main',
    imports: [
        NgClass,
        NgForOf,
        FormsModule
    ],
    templateUrl: './main.component.html',
    styleUrl: './main.component.css'
})
export class MainComponent implements OnDestroy {
    protected changes: number = 0;
    protected transports: Transport[] = [];
    protected filteredTransports: Transport[] = [];
    protected filteredTransport: Transport | undefined;
    protected truckDrivers: TruckDriver[] = [];
    private locationAddresses: LocationAddress[] = [];
    protected selectedTruckDriver: TruckDriver | undefined;
    protected startLocation: LocationAddress | undefined;
    protected endLocation: LocationAddress | undefined;
    private randomChangeSubscription: Subscription | null = null;

    constructor(
        private changeService: ChangeService,
        private driverService: DriverService,
        private routeService: RouteService,
    ) {
    }

    @HostBinding('style.--animation-duration')
    get animationDuration(): string {
        return `${5000 / this.changes}ms`;
    }

    ngOnInit() {
        this.changeService.mockGetChanges().subscribe((changes) => {
            this.changes = changes;
        });
        this.routeService.mockOptimizeRoute().subscribe((response) => {
            this.transports = response.transportPlan.transports;
        });
        this.driverService.mockGetDrivers().subscribe((response) => {
            this.truckDrivers = response;
        });
        this.routeService.mockGetLocationAddress().subscribe((response) => {
            this.locationAddresses = response;
        });
        this.startRandomChangeIncrement();
    }

    ngOnDestroy() {
        if (this.randomChangeSubscription) {
            this.randomChangeSubscription.unsubscribe();
        }
    }

    protected onClick() {
        this.routeService.mockOptimizeRoute().subscribe((response) => {
            this.transports = response.transportPlan.transports;
        });
        this.changes = 0;
    }

    private startRandomChangeIncrement() {
        this.randomChangeSubscription = interval(200).subscribe(() => {
            if (Math.random() < .05) {
                this.changes += Math.floor(Math.random() * 2);
            }
        });
    }

    protected onSelectTruckDriver() {
        const selectedDriverId = this.selectedTruckDriver!.driverId;
        this.filteredTransport = this.transports.find(transport =>
            transport.driverId.includes(selectedDriverId)
        );
        this.filteredTransports = this.transports.filter(transport =>
            transport.driverId.includes(selectedDriverId));

        if (this.filteredTransport) {
            this.startLocation = this.locationAddresses.find(location =>
                location.locationId === this.filteredTransport!.startLocationId
            );
            this.endLocation = this.locationAddresses.find(location =>
                location.locationId === this.filteredTransport!.endLocationId
            );
        } else {
            this.startLocation = undefined;
            this.endLocation = undefined;
        }
    }
}
