import { UpdateExerciseService } from './../../add-exercise.service';
import { ExerciseSet, SingleExerciseSet } from '../../model/workout-plan';
import { Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { UnitEnum } from 'src/app/add-workout-plan/exercise-add/create-custom-exercise/create-custom-exercise.page';

@Component({
  selector: 'app-exercise-set-edit-item',
  templateUrl: './exercise-set-edit-item.component.html',
  styleUrls: ['./exercise-set-edit-item.component.scss'],
})
export class ExerciseSetEditItemComponent implements OnInit {
  @Input() exerciseSet: ExerciseSet;
  @ViewChildren('repInputs') inputs: QueryList<any>;
  @ViewChildren('weightInputs') weightInputs: QueryList<any>;
  @ViewChildren('timeInputs') timeInputs: QueryList<any>;
  @Output() removeExercise = new EventEmitter<ExerciseSet>();

  constructor(public addExerciseService: UpdateExerciseService,
    ) {}

  ngOnInit() {}

  deleteExercise() {
    const indexToDelete = this.addExerciseService.exerciseAddSetList.findIndex(item => item.id === this.exerciseSet.id);
    this.addExerciseService.exerciseAddSetList.splice(indexToDelete, 1);
    this.removeExercise.emit(this.exerciseSet);
  }

  removeExerciseSet(index: number) {
    if (index > -1) {
      this.exerciseSet.exerciseSets.splice(index, 1);
    }
  }

  isTimeUnit(): boolean {
    const timeValues = this.exerciseSet.exercise.unit === 'time';
    return timeValues;
  }

  isLastElement(index: number): boolean {
    if (index === this.exerciseSet.exerciseSets.length - 1) {
      return true;
    }
    return false;
  }

  addExerciseSet(item: ExerciseSet) {
    this.exerciseSet.exerciseSets.push(new SingleExerciseSet());
    setTimeout(() => {
      if (item.exercise.unit === UnitEnum.timer) {
        this.weightInputs.last.setFocus();
      } else {
        this.inputs.last.setFocus();
      }
    },100);
  }

  onEnterReps() {
      this.weightInputs.last.setFocus();
  }
}
