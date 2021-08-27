import { DatabaseProvider } from './../../../database-provider';
import { Component, OnInit } from '@angular/core';
import { MuscleGroupFilter, WorkoutAdd } from '../exercise-add.page';
import { Location } from '@angular/common';
import { Exercise } from 'src/app/model/workout-plan';
import { UpdateExerciseService } from 'src/app/add-exercise.service';

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
    private updateExerciseService: UpdateExerciseService,
    private databaseProvider: DatabaseProvider
  ) {}

  ngOnInit() {
    this.initializeMuscleGroups();
    this.unit = UnitEnum.weight;
    this.exerciseType = ExerciseTypeEnum.none;
  }

  back() {
      this.location.back();
  }

  saveExercise() {
    const exercise = new Exercise('', this.title);
    exercise.unit = this.unit;
    exercise.exerciseType = this.exerciseType;
    exercise.muscleGroups = this.muscleGroups.filter(group => group.isChecked === true).map(item => item.title);
    this.databaseProvider.addExercise(exercise);
    const exerciseAdd = new WorkoutAdd(
      exercise.id,
      exercise.title,
      exercise.muscleGroups,
      true
    );
    this.updateExerciseService.checkedExercises.push(exerciseAdd)
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
