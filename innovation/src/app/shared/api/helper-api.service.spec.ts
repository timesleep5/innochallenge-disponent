import {TestBed} from '@angular/core/testing';

import {HelperApiService} from './helper-api.service';

describe('HelperApiService', () => {
    let service: HelperApiService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(HelperApiService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
