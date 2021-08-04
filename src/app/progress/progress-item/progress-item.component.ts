import { SingleExerciseSet } from './../../model/workout-plan';
import { WorkoutRun, ExecutedExercise } from './../../workout-run/workout-run.page';
import { Component, Input, OnInit } from '@angular/core';
import { Exercise } from 'src/app/model/workout-plan';

@Component({
  selector: 'app-progress-item',
  templateUrl: './progress-item.component.html',
  styleUrls: ['./progress-item.component.scss'],
})
export class ProgressItemComponent implements OnInit {
  @Input() workoutRun: WorkoutRun;
  expanded = false;

  constructor() { }

  ngOnInit() {}

  changeExpandItem() {
    this.expanded = !this.expanded;
  }

  isTimeUnit(exercise: SingleExerciseSet): boolean {
    const timeValues = exercise.time !== undefined;
    return timeValues;
  }

  isTimeTitle(exercise: ExecutedExercise): boolean {
    const timeValues = exercise.set[0].time !== undefined;
    return timeValues;
  }

}
