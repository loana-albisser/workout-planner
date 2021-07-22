import { SingleExerciseSet } from './../../../model/workout-plan';
import { UpdateExerciseService } from '../../../add-exercise.service';
import { Component, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ExerciseSet } from '../../../model/workout-plan';

@Component({
  selector: 'app-exercise-item-add-item',
  templateUrl: './exercise-item-add-item.component.html',
  styleUrls: ['./exercise-item-add-item.component.scss'],
})
export class ExerciseItemAddItemComponent implements OnInit {
  @Input() exerciseSet: ExerciseSet;
  @ViewChildren('repInputs') inputs: QueryList<any>;

  constructor(private addExerciseService: UpdateExerciseService) {}

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
    setTimeout(() => {
      this.inputs.last.setFocus();
    },100);
  }

  removeExerciseSet(index: number) {
    if (index > -1) {
      this.exerciseSet.exerciseSets.splice(index, 1);
    }
  }
}
