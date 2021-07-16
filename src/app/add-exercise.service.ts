import { Exercise, ExerciseSet } from './model/workout-plan';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AddExerciseService {
  exerciseAddSetList: Array<ExerciseSet> = Array();

  constructor() {}
}
