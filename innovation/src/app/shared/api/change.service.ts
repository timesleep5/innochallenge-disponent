import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ChangeService {

    constructor() {
    }

    public getChanges(): Observable<any> {
        return of(5);
    }
}
