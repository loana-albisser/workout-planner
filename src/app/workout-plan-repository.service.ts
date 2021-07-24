import { Injectable } from '@angular/core';
import { WorkoutPlan } from './model/workout-plan';

@Injectable({
  providedIn: 'root'
})
export class WorkoutPlanRepositoryService {
  allWorkoutPlans: Array<WorkoutPlan>  = Array();

  constructor() { }
}


