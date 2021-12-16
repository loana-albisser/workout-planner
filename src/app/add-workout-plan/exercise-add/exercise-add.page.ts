import { TranslateService } from '@ngx-translate/core';
import { UnitEnum } from './create-custom-exercise/create-custom-exercise.page';
import { ExerciseSet, SingleExerciseSet } from '../../model/workout-plan';
import { Exercise } from '../../model/workout-plan';
import { UpdateExerciseService } from '../../add-exercise.service';
import { DatabaseProvider } from '../../database-provider';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConstantPool } from '@angular/compiler';

@Component({
  selector: 'app-exercise-add',
  templateUrl: './exercise-add.page.html',
  styleUrls: ['./exercise-add.page.scss'],
})
export class ExerciseAddPage implements OnInit {
  workoutAddList: Array<WorkoutAdd> = Array();
  fullWorkoutList: Array<WorkoutAdd> = Array();
  muscleGroups: Array<MuscleGroupFilter> = Array();
  chipSelectedColor = 'primary';
  searchItem = '';

  constructor(
    private router: Router,
    private translateService: TranslateService,
    private databaseProvider: DatabaseProvider,
    private addExerciseService: UpdateExerciseService
  ) {}

  ngOnInit() {
    this.receiveAllExercises();
    this.initializeMuscleGroups();
  }

  ionViewWillEnter() {
    this.addExerciseService.checkedExercises.forEach((item) => {
      const isChecked = this.addExerciseService.checkedExercises.includes(item);
      const workoutAddItem = this.workoutAddList.find((i) => i.id === item.id);
      if (workoutAddItem !== null && workoutAddItem !== undefined) {
        workoutAddItem.isChecked = isChecked;
      }
    });
  }

  checkedChanged(event: CustomEvent, workoutAddItem: WorkoutAdd) {
    const isChecked = event.detail.checked;
    if (isChecked) {
      this.addExerciseService.checkedExercises.push(workoutAddItem);
    } else {
      const indexToDelete =
        this.addExerciseService.checkedExercises.indexOf(workoutAddItem);
      this.addExerciseService.checkedExercises.splice(indexToDelete, 1);
    }
  }

  initializeMuscleGroups() {
    this.databaseProvider.receiveMuscleGroups().then((result) => {
      result.forEach((item) => {
        this.muscleGroups.push(new MuscleGroupFilter(item.id, item.title));
      });
    });
  }

  back() {
    this.addExerciseService.checkedExercises = Array();
    window.history.back();
  }

  changeFilter(filter: MuscleGroupFilter) {
    this.muscleGroups.find((item) => item.id === filter.id).isChecked =
      !filter.isChecked;
    const selectedMuscleGroups = this.muscleGroups.filter(
      (item) => item.isChecked === true
    );
    this.applyMuscleGroupFilter(selectedMuscleGroups);
  }

  applyMuscleGroupFilter(selectedMuscleGroups: MuscleGroupFilter[]) {
    if (selectedMuscleGroups.length === 0) {
      this.workoutAddList = this.fullWorkoutList;
    } else {
      const newExerciseList = Array();
      selectedMuscleGroups.forEach((item) => {
        const exercises = this.fullWorkoutList.filter((workout) =>
          workout.muscleGroups?.includes(item.id)
        );
        exercises.forEach((exercise) => {
          newExerciseList.push(exercise);
        });
      });
      this.workoutAddList = newExerciseList;
    }
  }

  saveSelectedExercises() {
    this.addExerciseService.checkedExercises = Array();
    const selectedExercises = this.workoutAddList.filter(
      (item) => item.isChecked === true
    );
    const exerciseSetList = Array();
    selectedExercises.forEach((item, index) => {
      const exercise = new Exercise(item.id, item.title);
      exercise.unit = item.unit as UnitEnum;
      const singleExerciseSetList = Array<SingleExerciseSet>();
      singleExerciseSetList.push(new SingleExerciseSet());
      const exerciseSet = new ExerciseSet(
        index.toString(),
        exercise,
        singleExerciseSetList,
        false
      );
      exerciseSetList.push(exerciseSet);
    });
    exerciseSetList.forEach((item) => {
      this.addExerciseService.exerciseAddSetList.push(item);
    });
    window.history.back();
  }

  createCustomExercise() {
    this.router.navigate(['/create-custom-exercise']);
  }

  doOnSearchClear() {
    const selectedMuscleGroups = this.muscleGroups.filter(
      (item) => item.isChecked === true
    );
    this.applyMuscleGroupFilter(selectedMuscleGroups);
  }

  search(event: any, filter: MuscleGroupFilter) {
    let value: string;
    if (event.detail != null) {
      value = event.detail.value;
    } else {
      value = event;
    }
    this.searchItem = value;
    if (value === '') {
      const selectedMuscleGroups = this.muscleGroups.filter(
        (item) => item.isChecked === true
      );
      if (filter == null && selectedMuscleGroups.length === 0) {
        this.workoutAddList = this.fullWorkoutList;
      }
      if (filter != null) {
        this.changeFilter(filter);
      } else {
        this.applyMuscleGroupFilter(selectedMuscleGroups);
      }
    } else {
      if (filter != null) {
        const muscleGroups = this.muscleGroups.find(
          (item) => item.id === filter.id
        );
        if (muscleGroups !== undefined) {
          muscleGroups.isChecked = !filter.isChecked;
        }
      }
      const selectedMuscleGroups = this.muscleGroups.filter(
        (item) => item.isChecked === true
      );
      if (selectedMuscleGroups.length > 0) {
        const newExerciseList = Array();
        selectedMuscleGroups.forEach((item) => {
          const exercises = this.fullWorkoutList.filter((workout) =>
            workout.muscleGroups?.includes(item.id)
          );
          exercises.forEach((exercise) => {
            this.translateService.get(exercise.title).subscribe((trans) => {
              if (trans.toLowerCase().includes(value.toLowerCase())) {
                newExerciseList.push(exercise);
              }
            });
          });
        });
        this.workoutAddList = newExerciseList;
      } else {
        const newExerciseList = Array();
        this.fullWorkoutList.forEach((exercise) => {
          this.translateService.get(exercise.title).subscribe((trans) => {
            if (trans.toLowerCase().includes(value.toLowerCase())) {
              newExerciseList.push(exercise);
            }
          });
        });
        this.workoutAddList = newExerciseList;
      }
    }
  }

  receiveAllExercises() {
    this.databaseProvider.getAllExercises();
    this.databaseProvider.onExercisesChanged.subscribe((result) => {
      const workoutAddList = Array();
      result.forEach((value) => {
        const workoutAdd = new WorkoutAdd(
          value.id,
          value.title,
          value.muscleGroups,
          false
        );
        workoutAdd.unit = value.unit;
        workoutAddList.push(workoutAdd);
      });
      this.workoutAddList = workoutAddList;
      this.fullWorkoutList = workoutAddList.map((obj) =>
        Object.assign({}, obj)
      );
    });
  }
}

export class WorkoutAdd {
  unit: string;
  constructor(
    public id: string,
    public title: string,
    public muscleGroups: string[],
    public isChecked: boolean
  ) {}
}

export class MuscleGroupFilter {
  isChecked: boolean;
  constructor(public id: string, public title: string) {}
}
