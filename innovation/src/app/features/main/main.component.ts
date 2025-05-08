import {Component, HostBinding, OnDestroy} from '@angular/core';
import {RouteService} from '../../shared/api/route.service';
import {ChangeService} from '../../shared/api/change.service';
import {Transport} from '../../shared/datatype/Transport';
import {NgClass} from '@angular/common';
import {interval, Subscription} from 'rxjs';

@Component({
    selector: 'app-main',
    imports: [
        NgClass
    ],
    templateUrl: './main.component.html',
    styleUrl: './main.component.css'
})
export class MainComponent implements OnDestroy {
    protected changes: number = 0;
    protected transports: Transport[] = [];
    private randomChangeSubscription: Subscription | null = null;

    constructor(
        private changeService: ChangeService,
        private routeService: RouteService,
    ) {
    }

    @HostBinding('style.--animation-duration')
    get animationDuration(): string {
        return `${5000 / this.changes}ms`;
    }

    ngOnInit() {
        this.changeService.getChanges().subscribe((changes) => {
            this.changes = changes;
        });
        this.routeService.optimizeMock().subscribe((response) => {
            this.transports = response.transportPlan.transports;
        });
        this.startRandomChangeIncrement();
    }

    ngOnDestroy() {
        if (this.randomChangeSubscription) {
            this.randomChangeSubscription.unsubscribe();
        }
    }

    private startRandomChangeIncrement() {
        this.randomChangeSubscription = interval(200).subscribe(() => {
            if (Math.random() < .05) {
                this.changes += Math.floor(Math.random() * 2);
            }
        });
    }

    onClick() {
        console.log(this.changes);
        console.log(this.transports);
        this.changes = 0;
    }
}
