import { DatabaseProvider } from './../../../database-provider';
import { Component, OnInit } from '@angular/core';
import { MuscleGroupFilter } from '../exercise-add.page';
import { Location } from '@angular/common';
import { Exercise } from 'src/app/model/workout-plan';

@Component({
  selector: 'app-create-custom-exercise',
  templateUrl: './create-custom-exercise.page.html',
  styleUrls: ['./create-custom-exercise.page.scss'],
})
export class CreateCustomExercisePage implements OnInit {
  title: string;
  repetitions: string;
  weight: string;
  timeInSeconds: number;
  timeAsString: string;
  unit: UnitEnum;
  exerciseType: ExerciseTypeEnum;
  muscleGroups: Array<MuscleGroupFilter> = Array();

  constructor(
    private location: Location,
    private databaseProvider: DatabaseProvider
  ) {}

  ngOnInit() {
    this.initializeMuscleGroups();
    this.unit = UnitEnum.weight;
    this.exerciseType = ExerciseTypeEnum.none;
  }

  saveExercise() {
    const exercise = new Exercise('', this.title);
    exercise.unit = this.unit;
    exercise.exerciseType = this.exerciseType;
    exercise.muscleGroups = this.muscleGroups.filter(group => group.isChecked === true).map(item => item.title);
    this.databaseProvider.addExercise(exercise);
    this.location.back();
  }

  isUnitWeight(): boolean {
    return this.unit === UnitEnum.weight;
  }

  initializeMuscleGroups() {
    this.databaseProvider.receiveMuscleGroups().then((result) => {
      result.forEach((item) => {
        this.muscleGroups.push(new MuscleGroupFilter(item.id, item.title));
      });
    });
  }
}

export enum UnitEnum {
  weight = 'weight',
  timer = 'time',
}

export enum ExerciseTypeEnum {
  machine = 'machine',
  bodyWeight = 'bodyWeight',
  none = 'none',
}
