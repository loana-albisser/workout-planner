import { ExerciseSet, SingleExerciseSet } from '../../model/workout-plan';
import { Exercise } from '../../model/workout-plan';
import { UpdateExerciseService } from '../../add-exercise.service';
import { DatabaseProvider } from '../../database-provider';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-exercise-add',
  templateUrl: './exercise-add.page.html',
  styleUrls: ['./exercise-add.page.scss'],
})
export class ExerciseAddPage implements OnInit {
  workoutAddList: Array<WorkoutAdd>  = Array();
  fullWorkoutList: Array<WorkoutAdd>  = Array();
  muscleGroups: Array<MuscleGroupFilter> = Array();
  chipSelectedColor = 'primary';

  constructor(private location: Location,
    private router: Router,
    private databaseProvider: DatabaseProvider,
    private addExerciseService: UpdateExerciseService) {

  }

  ngOnInit() {
    this.receiveAllExercises();
    this.initializeMuscleGroups();
  }

  initializeMuscleGroups() {
    this.databaseProvider.receiveMuscleGroups().then(result => {
      result.forEach(item => {
        this.muscleGroups.push(new MuscleGroupFilter(item.id, item.title));
      });
    });
  }

  changeFilter(filter: MuscleGroupFilter) {
    this.muscleGroups.find(item => item.id === filter.id).isChecked = !filter.isChecked;
      const selectedMuscleGroups = this.muscleGroups.filter(item => item.isChecked === true);
      if (selectedMuscleGroups.length === 0) {
        this.workoutAddList = this.fullWorkoutList;
      } else {
        const newExerciseList = Array();
        selectedMuscleGroups.forEach(item => {
          const exercises = this.fullWorkoutList.filter(workout => workout.muscleGroups?.includes(item.id));
          exercises.forEach(exercise => {
            newExerciseList.push(exercise);
          });
        });
        this.workoutAddList = newExerciseList;
      }


  }

  saveSelectedExercises() {
   const selectedExercises = this.workoutAddList.filter(item => item.isChecked === true);
   const exerciseSetList = Array();
   selectedExercises.forEach((item, index) => {
      const exercise = new Exercise(item.id, item.title);
      exercise.unit = item.unit;
      const singleExerciseSetList = Array<SingleExerciseSet>();
      singleExerciseSetList.push(new SingleExerciseSet());
      const exerciseSet = new ExerciseSet(index.toString(), exercise, singleExerciseSetList);
      exerciseSetList.push(exerciseSet);
   });
   exerciseSetList.forEach(item => {
    this.addExerciseService.exerciseAddSetList.push(item);
   });
   this.location.back();
  }

  createCustomExercise() {
    this.router.navigate(['/create-custom-exercise']);
  }

  search(event: CustomEvent) {
      const value: string = event.detail.value;
      if (value === '') {
        this.workoutAddList = this.fullWorkoutList;
      } else {
        this.workoutAddList = this.fullWorkoutList.filter(item => item.title.toLowerCase().includes(value.toLowerCase()));
      }
  }

  receiveAllExercises() {
      this.databaseProvider.getAllExercises().then(result => {
        const workoutAddList = Array();
        result.forEach(value => {
            const workoutAdd = new WorkoutAdd(value.id, value.title, value.muscleGroups, false);
            workoutAdd.unit = value.unit;
            workoutAddList.push(workoutAdd);
        });
        this.workoutAddList = workoutAddList;
        this.fullWorkoutList = workoutAddList.map((obj) => Object.assign({}, obj));
      });
  }
}

export class WorkoutAdd {
  unit: string;
  constructor(public id: string, public title: string, public muscleGroups: string[], public isChecked: boolean) {}
}

export class MuscleGroupFilter {
  isChecked: boolean;
  constructor(public id: string, public title: string) {}
}
