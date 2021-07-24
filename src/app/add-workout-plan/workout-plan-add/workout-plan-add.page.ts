import { ExerciseSet, WorkoutPlan } from './../../model/workout-plan';
import { DatabaseProvider } from './../../database-provider';
import { UpdateExerciseService } from '../../add-exercise.service';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { AuthenticationService } from 'src/app/authentication.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-workout-plan-add',
  templateUrl: './workout-plan-add.page.html',
  styleUrls: ['./workout-plan-add.page.scss'],
})
export class WorkoutPlanAddPage implements OnInit {
  title: string;

  constructor(
    public translateService: TranslateService,
    public addExerciseService: UpdateExerciseService,
    private databaseProvider: DatabaseProvider,
    private location: Location
  ) {}

  ngOnInit() {}

  removeExercise(exerciseSet: ExerciseSet) {
    // this.addExerciseService.removedExercises.push(exerciseSet);
  }
  saveWorkoutPlan() {
    const workoutPlan = new WorkoutPlan();
    workoutPlan.title = this.title;
    workoutPlan.exerciseSets = this.addExerciseService.exerciseAddSetList;

    this.databaseProvider.addWorkoutPlan(workoutPlan).then(workoutPlanId => {
      this.addExerciseService.exerciseAddSetList.forEach((item) => {
        this.databaseProvider.setExerciseSet(
          item.exercise.id,
          item.exerciseSets
        ).then(exerciseSetId => {
          this.databaseProvider.addExerciseSetToWorkoutPlan(workoutPlanId, exerciseSetId);
        });
      });
    });
    this.location.back();
  }

  onReorderItems(event) {
    const draggedItem = this.addExerciseService.exerciseAddSetList.splice(event.detail.from,1)[0];
    this.addExerciseService.exerciseAddSetList.splice(event.detail.to,0,draggedItem);
   event.detail.complete();
  }
}
