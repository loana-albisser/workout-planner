import { TestBed } from '@angular/core/testing';

import { UpdateExerciseService } from './add-exercise.service';

describe('AddExerciseService', () => {
  let service: UpdateExerciseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UpdateExerciseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
