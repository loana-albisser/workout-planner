import { WorkoutAdd } from './add-workout-plan/exercise-add/exercise-add.page';
import { Exercise, ExerciseSet } from './model/workout-plan';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UpdateExerciseService {
  exerciseAddSetList: Array<ExerciseSet> = Array();
  removedExercises: Array<ExerciseSet> = Array();
  checkedExercises: Array<WorkoutAdd> = Array();

  constructor() {}
}
