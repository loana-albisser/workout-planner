import { Exercise } from './model/workout-plan';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AddExerciseService {
  workoutAddList: Array<Exercise>  = Array();

  constructor() { }
}
