import {TestBed} from '@angular/core/testing';

import {CapgeminiApiService} from './capgemini-api.service';

describe('CapgeminiApiService', () => {
    let service: CapgeminiApiService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(CapgeminiApiService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
