import {Component} from '@angular/core';
import {RouteService} from '../../shared/api/route.service';
import {ChangeService} from '../../shared/api/change.service';
import {Transport} from '../../shared/datatype/Transport';

@Component({
    selector: 'app-main',
    imports: [],
    templateUrl: './main.component.html',
    styleUrl: './main.component.css'
})
export class MainComponent {
    protected changes: number = 0;
    protected transports: Transport[] = [];

    constructor(
        private changeService: ChangeService,
        private routeService: RouteService,
    ) {
    }

    ngOnInit() {
        this.changeService.getChanges().subscribe((changes) => {
            this.changes = changes;
        });
        this.routeService.optimizeMock().subscribe((response) => {
            this.transports = response.transportPlan.transports;
        });
    }

    onClick() {
        console.log(this.changes);
        console.log(this.transports);
    }
}
