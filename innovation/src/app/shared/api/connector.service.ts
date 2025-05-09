import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'any'
})
export class ConnectorService {

    constructor(
        private http: HttpClient
    ) {
    }

    add(url: string, body: any): Observable<any> {
        return this.http.post(
            url, body,
            {headers: this.buildSendHeader()}
        );
    }

    put(url: string, body: any): Observable<any> {
        return this.http.put(
            url, body,
            {headers: this.buildSendHeader()}
        );
    }

    get(url: string): Observable<any> {
        return this.http.get(
            url,
            {headers: this.buildRequestHeader()}
        );
    }

    update(url: string, body: any): Observable<any> {
        return this.http.patch(
            url, body,
            {headers: this.buildSendHeader()}
        );
    }

    delete(url: string): Observable<any> {
        return this.http.delete(
            url,
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
