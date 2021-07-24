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
    this.muscleGroups.push(new MuscleGroupFilter('leg'));
    this.muscleGroups.push(new MuscleGroupFilter('back'));
    this.muscleGroups.push(new MuscleGroupFilter('arms'));
    this.muscleGroups.push(new MuscleGroupFilter('core'));
    this.muscleGroups.push(new MuscleGroupFilter('chest'));
    this.muscleGroups.push(new MuscleGroupFilter('biceps'));
    this.muscleGroups.push(new MuscleGroupFilter('triceps'));
  }

  changeFilter(filter: MuscleGroupFilter) {
    debugger;
    this.muscleGroups.find(item => item.title === filter.title).isChecked = !filter.isChecked;
      const selectedMuscleGroups = this.muscleGroups.filter(item => item.isChecked === true);
      if (selectedMuscleGroups.length === 0) {
        this.workoutAddList = this.fullWorkoutList;
      } else {
        const newExerciseList = Array();
        selectedMuscleGroups.forEach(item => {
          const exercises = this.fullWorkoutList.filter(workout => workout.muscleGroups?.includes(item.title));
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
