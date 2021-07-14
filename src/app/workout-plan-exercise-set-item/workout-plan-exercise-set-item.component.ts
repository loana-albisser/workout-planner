import { ExerciseSet } from './../model/workout-plan';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-workout-plan-exercise-set-item',
  templateUrl: './workout-plan-exercise-set-item.component.html',
  styleUrls: ['./workout-plan-exercise-set-item.component.scss'],
})
export class WorkoutPlanExerciseSetItemComponent implements OnInit {
  @Input("exerciseSet")
  exerciseSet: ExerciseSet
  
  constructor() { }

  ngOnInit() {}

  hasSets(): boolean {
    return this.exerciseSet.exerciseSets.length > 0
  }
}
