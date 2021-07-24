import { ExerciseSet, SingleExerciseSet } from '../../model/workout-plan';
import { Exercise } from '../../model/workout-plan';
import { UpdateExerciseService } from '../../add-exercise.service';
import { DatabaseProvider } from '../../database-provider';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

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
    private databaseProvider: DatabaseProvider,
    private addExerciseService: UpdateExerciseService) {

  }

  ngOnInit() {
    this.receiveAllExercises();
    this.initializeMuscleGroups();
  }

  initializeMuscleGroups() {
    this.muscleGroups.push(new MuscleGroupFilter('Leg'));
    this.muscleGroups.push(new MuscleGroupFilter('Back'));
    this.muscleGroups.push(new MuscleGroupFilter('Arms'));
    this.muscleGroups.push(new MuscleGroupFilter('Core'));
    this.muscleGroups.push(new MuscleGroupFilter('Chest'));
    this.muscleGroups.push(new MuscleGroupFilter('Biceps'));
    this.muscleGroups.push(new MuscleGroupFilter('Triceps'));
  }

  changeFilter(filter: MuscleGroupFilter) {
    // TODO change to title instead of id
    this.muscleGroups.find(item => item.title === filter.title).isChecked = !filter.isChecked;
    this.workoutAddList = this.fullWorkoutList.filter(item => item.muscleGroups.includes(filter.title));  }

  saveSelectedExercises() {
   const selectedExercises = this.workoutAddList.filter(item => item.isChecked === true);
   const exerciseSetList = Array();
   selectedExercises.forEach((item, index) => {
      const exercise = new Exercise(item.id, item.title);
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
            workoutAddList.push(workoutAdd);
        });
        this.workoutAddList = workoutAddList;
        this.fullWorkoutList = workoutAddList.map((obj) => Object.assign({}, obj));
      });
  }
}

export class WorkoutAdd {
  constructor(public id: string, public title: string, public muscleGroups: string[], public isChecked: boolean) {}
}

export class MuscleGroupFilter {
  id: string;
  isChecked: boolean;
  constructor(public title: string) {}
}
