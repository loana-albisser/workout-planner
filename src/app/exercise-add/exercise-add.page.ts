import { AddExerciseService } from './../add-exercise.service';
import { DatabaseProvider } from './../database-provider';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-exercise-add',
  templateUrl: './exercise-add.page.html',
  styleUrls: ['./exercise-add.page.scss'],
})
export class ExerciseAddPage implements OnInit {
  workoutAddList: Array<WorkoutAdd>  = Array();

  constructor(private location: Location,
    private databaseProvider: DatabaseProvider,
    private addExerciseService: AddExerciseService) {
  }

  ngOnInit() {
    this.receiveAllExercises();
  }

  saveSelectedExercises() {
   const selectedExercises = this.workoutAddList.filter(item => item.isChecked === true);
   this.addExerciseService.workoutAddList = selectedExercises;
   this.location.back();
  }

  receiveAllExercises() {
      this.databaseProvider.getAllExercises().then(result => {
        const workoutAddList = Array();
        result.forEach(value => {
            const workoutAdd = new WorkoutAdd(value.id, value.title, false);
            workoutAddList.push(workoutAdd);
        });
        this.workoutAddList = workoutAddList;
      });
  }
}

export class WorkoutAdd {
  constructor(public id: string, public title: string, public isChecked: boolean) {}
}
