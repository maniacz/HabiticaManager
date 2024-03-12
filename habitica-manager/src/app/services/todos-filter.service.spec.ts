import { TestBed } from '@angular/core/testing';

import { TodosFilterService } from './todos-filter.service';

describe('TodosFilterService', () => {
  let service: TodosFilterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TodosFilterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
