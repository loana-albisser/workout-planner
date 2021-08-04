import { ExerciseSet, SingleExerciseSet } from './../model/workout-plan';
import { DatabaseProvider } from './../database-provider';
import { WorkoutPlanRepositoryService } from './../workout-plan-repository.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkoutPlan } from '../model/workout-plan';
import { Location } from '@angular/common';
import { UpdateExerciseService } from '../add-exercise.service';
import { AuthenticationService } from '../authentication.service';
import { UnitEnum } from '../add-workout-plan/exercise-add/create-custom-exercise/create-custom-exercise.page';

@Component({
  selector: 'app-workout-plan-detail',
  templateUrl: './workout-plan-detail.page.html',
  styleUrls: ['./workout-plan-detail.page.scss'],
})
export class WorkoutPlanDetailPage implements OnInit {
  selectedPlan: WorkoutPlan = new WorkoutPlan('', '', '', false, []);
  orderChanged: boolean;
  title: string;

  constructor(
    private location: Location,
    private router: Router,
    private authenticationService: AuthenticationService,
    public activatedRoute: ActivatedRoute,
    private databaseProvider: DatabaseProvider,
    public addExerciseService: UpdateExerciseService,
    private workoutPlanRepositoryService: WorkoutPlanRepositoryService
  ) {}

  ngOnInit() {
    const planId = this.activatedRoute.snapshot.paramMap.get('id');
    this.selectedPlan = this.workoutPlanRepositoryService.allWorkoutPlans.find(
      (p) => p.id === planId
    );
    this.title = this.selectedPlan.title;
  }

  delete() {
    this.databaseProvider.removeWorkoutPlan(this.selectedPlan.id);
    this.location.back();
  }

  archive() {
    this.databaseProvider.updateWorkoutPlanArchive(this.selectedPlan.id, true);
    this.location.back();
  }

  unarchive() {
    this.databaseProvider.updateWorkoutPlanArchive(this.selectedPlan.id, false);
    this.location.back();
  }

  onReorderItems(event) {
    this.orderChanged = true;
    const draggedItem = this.selectedPlan.exerciseSets.splice(
      event.detail.from, 1)[0];
    this.selectedPlan.exerciseSets.splice(event.detail.to, 0, draggedItem);
    event.detail.complete();
  }

  cancel() {
    this.location.back();
  }

  removeExercise(exerciseSet: ExerciseSet) {
    const indexToDelete = this.selectedPlan.exerciseSets.findIndex(
      (item) => item.id === exerciseSet.id
    );
    this.selectedPlan.exerciseSets.splice(indexToDelete, 1);
    this.addExerciseService.removedExercises.push(exerciseSet);
  }

  saveWorkoutPlan() {
    this.selectedPlan.exerciseSets.forEach((sets) => {
      if (sets.exercise.unit !== UnitEnum.timer) {
        sets.exerciseSets.map(set => delete set.time);
      }
      debugger;
      this.databaseProvider.updateExerciseSet(sets.id, sets.exerciseSets);
    });
    this.addExerciseService.exerciseAddSetList.forEach((sets) => {

      sets.exerciseSets.forEach(set => {
        if (sets.exercise.unit !== UnitEnum.timer) {
           delete set.time;
        }
      });
      const singleExerciseSet = new ExerciseSet('', sets.exercise, sets.exerciseSets);
      this.databaseProvider.addExerciseSet(singleExerciseSet).then(data => {
        this.databaseProvider.addExerciseSetToWorkoutPlan(this.selectedPlan.id, data);
      });
    });
    // const exerciseIds = this.selectedPlan.exerciseSets.concat(this.addExerciseService.exerciseAddSetList).map(set => set.id);
    if (this.title !== this.selectedPlan.title) {
      this.databaseProvider.updateWorkoutPlanTitle(
        this.selectedPlan.id,
        this.title
      );
    }
    this.router.navigate([
      '/home',
      { uid: this.authenticationService.currentUser },
    ]);
  }
}
