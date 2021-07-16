import { SingleExerciseSet } from './../../../model/workout-plan';
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

  isLastElement(index: number): boolean {
    if (index === this.exerciseSet.exerciseSets.length - 1) {
      return true;
    }
    return false;
  }

  addExerciseSet() {
    const oldExerciseSets = Array();
    Object.assign(oldExerciseSets, this.exerciseSet.exerciseSets);
    oldExerciseSets.push(new SingleExerciseSet());
    this.addExerciseService.exerciseAddSetList.find(
      (item) => item.id === this.exerciseSet.id
    ).exerciseSets = oldExerciseSets;
  }

  removeExerciseSet(index: number) {
    const selectedExerciseSet = this.addExerciseService.exerciseAddSetList.find(
      (item) => item.id === this.exerciseSet.id
    );
    delete selectedExerciseSet.exerciseSets[index];
    delete this.exerciseSet.exerciseSets[index];
  }
}
