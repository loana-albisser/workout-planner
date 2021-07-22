import { Exercise, ExerciseSet } from './model/workout-plan';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UpdateExerciseService {
  exerciseAddSetList: Array<ExerciseSet> = Array();
  removedExercises: Array<ExerciseSet> = Array();

  constructor() {}
}
