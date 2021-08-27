import { ExerciseSet, WorkoutPlan } from './../../model/workout-plan';
import { DatabaseProvider } from './../../database-provider';
import { UpdateExerciseService } from '../../add-exercise.service';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

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
    private router: Router,
    private location: Location
  ) {}

  ngOnInit() {

  }

  goToAddExercisePage() {
    this.router.navigate(['/add-exercise']);
  }

  removeExercise(exerciseSet: ExerciseSet) {
    const indexToDelete = this.addExerciseService.exerciseAddSetList.findIndex(
      (item) => item.id === exerciseSet.id
    );
    this.addExerciseService.exerciseAddSetList.splice(indexToDelete, 1);
  }

  async saveWorkoutPlan() {
    const workoutPlan = new WorkoutPlan();
    workoutPlan.title = this.title;
    workoutPlan.exerciseSets = this.addExerciseService.exerciseAddSetList;

    this.databaseProvider.addWorkoutPlan(workoutPlan).then(async workoutPlanId => {
      const exerciseSetIds = Array();
      const promises = [];
      this.addExerciseService.exerciseAddSetList.forEach(async item => {
        const addExercisePromise =  this.databaseProvider.addExerciseSet(item).then(async data => {
          exerciseSetIds.push(data);
        });
        promises.push(addExercisePromise);
      });
      Promise.all(promises).then(() => {
        this.databaseProvider.addExerciseSetsToWorkoutPlan(workoutPlanId, exerciseSetIds);
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
