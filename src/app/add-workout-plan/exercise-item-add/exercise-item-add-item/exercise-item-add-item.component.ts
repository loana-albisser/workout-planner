import { SingleExerciseSet } from '../../../model/workout-plan';
import { AddExerciseService } from '../../../add-exercise.service';
import { Component, Input, OnInit } from '@angular/core';
import { ExerciseSet } from '../../../model/workout-plan';

@Component({
  selector: 'app-exercise-item-add-item',
  templateUrl: './exercise-item-add-item.component.html',
  styleUrls: ['./exercise-item-add-item.component.scss'],
})
export class ExerciseItemAddItemComponent implements OnInit {
  @Input() exerciseSet: ExerciseSet;

  constructor(private addExerciseService: AddExerciseService) {}

  ngOnInit() {}

  addExerciseSet() {
    const oldExerciseSets = Array();
    Object.assign(oldExerciseSets, this.exerciseSet.exerciseSets);
    oldExerciseSets.push(new SingleExerciseSet());
    // const oldExerciseSets = this.exerciseSet.exerciseSets;
    // oldExerciseSets.push(new SingleExerciseSet());
    // const singleExerciseSet = new SingleExerciseSet();
    // this.exerciseSet.exerciseSets = oldExerciseSets;
    this.addExerciseService.exerciseAddSetList.find(
      (item) => item.id === this.exerciseSet.id
    ).exerciseSets = oldExerciseSets;
    // const test = this.addExerciseService.exerciseAddSetList;
    const test = this.addExerciseService.exerciseAddSetList;
    debugger;
    // this.addExerciseService.exerciseAddSetList = Array();
  }
}
