import { Injectable } from '@angular/core';
import { WorkoutPlan } from './workout-plan';

@Injectable({
  providedIn: 'root'
})
export class WorkoutPlanRepositoryService {
  allWorkoutPlans: Array<WorkoutPlan>  = Array()

  constructor() { }
}


