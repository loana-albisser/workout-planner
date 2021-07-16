import { AddExerciseService } from './../../add-exercise.service';
import { ExerciseSet, SingleExerciseSet } from '../../model/workout-plan';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-exercise-set-edit-item',
  templateUrl: './exercise-set-edit-item.component.html',
  styleUrls: ['./exercise-set-edit-item.component.scss'],
})
export class ExerciseSetEditItemComponent implements OnInit {
  @Input() exerciseSet: ExerciseSet;

  constructor() {}

  ngOnInit() {}

  addExerciseSet() {
    this.exerciseSet.exerciseSets.push(new SingleExerciseSet());
  }

  removeExerciseSet(index: number) {
    if (index > -1) {
      this.exerciseSet.exerciseSets.splice(index, 1);
    }
  }
}
