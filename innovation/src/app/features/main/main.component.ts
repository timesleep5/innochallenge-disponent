import {Component, HostBinding, OnDestroy} from '@angular/core';
import {RouteService} from '../../shared/api/route.service';
import {ChangeService} from '../../shared/api/change.service';
import {Transport} from '../../shared/datatype/Transport';
import {NgClass, NgForOf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {interval, Subscription} from 'rxjs';
import {DriverService} from '../../shared/api/driver.service';
import {TruckDriver} from '../../shared/datatype/TruckDriver';

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
    protected truckDrivers: TruckDriver[] = [];
    protected selectedTruckDriver: TruckDriver | undefined;
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
        this.startRandomChangeIncrement();
    }

    ngOnDestroy() {
        if (this.randomChangeSubscription) {
            this.randomChangeSubscription.unsubscribe();
        }
    }

    onClick() {
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
}
