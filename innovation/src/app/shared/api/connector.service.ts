import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ConnectorService {
    private url = 'http://127.0.0.1:8000/'

    constructor(
        private http: HttpClient
    ) {
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
