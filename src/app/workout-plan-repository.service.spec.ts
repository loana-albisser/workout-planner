import { TestBed } from '@angular/core/testing';

import { WorkoutPlanRepositoryService } from './workout-plan-repository.service';

describe('WorkoutPlanRepositoryService', () => {
  let service: WorkoutPlanRepositoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkoutPlanRepositoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
