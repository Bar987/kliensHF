import { TestBed } from '@angular/core/testing';

import { DeleteCompService } from './delete-comp.service';

describe('DeleteCompService', () => {
  let service: DeleteCompService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeleteCompService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
