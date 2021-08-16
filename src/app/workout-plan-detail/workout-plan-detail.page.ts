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

  ionViewWillEnter(){
    this.addExerciseService.exerciseAddSetList.forEach(item => {
      this.selectedPlan.exerciseSets.push(item);
    });
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
   // const allExerciseSets = [].concat(this.selectedPlan.exerciseSets, this.addExerciseService.exerciseAddSetList);
    // const draggedItem = allExerciseSets.splice(event.detail.from, 1)[0];
    // this.selectedPlan.exerciseSets.splice(event.detail.to, 1, draggedItem);
    // const allExerciseSets = this.selectedPlan.exerciseSets.concat(this.addExerciseService.exerciseAddSetList);
    this.move(this.selectedPlan.exerciseSets, event.detail.from, event.detail.to);
    // this.selectedPlan.exerciseSets.concat(this.addExerciseService.exerciseAddSetList).splice(event.detail.to, 0, draggedItem);
    // this.selectedPlan.exerciseSets.concat(this.addExerciseService.exerciseAddSetList).splice(event.detail.from, 1);
    const test = this.selectedPlan.exerciseSets;
    event.detail.complete();
  }

  move(arr: any[], fromIndex: number, toIndex: number) {
    const element = arr[fromIndex];
    arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, element);
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
      if (sets.id !== '0') {
        this.databaseProvider.updateExerciseSet(sets.id, sets.exerciseSets);
      }
    });
    this.addExerciseService.exerciseAddSetList.forEach(async (sets) => {

      sets.exerciseSets.forEach(set => {
        if (sets.exercise.unit !== UnitEnum.timer) {
           delete set.time;
        }
      });
      const singleExerciseSet = new ExerciseSet('', sets.exercise, sets.exerciseSets);
      await this.databaseProvider.addExerciseSet(singleExerciseSet).then(async data => {
        this.selectedPlan.exerciseSets.find(item => item === sets).id = data;
        const ids = this.selectedPlan.exerciseSets.map(set => set.id);
        this.databaseProvider.addExerciseSetsToWorkoutPlan(this.selectedPlan.id, ids);
      });
    });
    this.addExerciseService.removedExercises.forEach(async set => {
      await this.databaseProvider.removeExerciseSet(set);
      await this.databaseProvider.removeExerciseSetFromWorkoutPlan(this.selectedPlan.id, set.id);
    });
    const exerciseIds = this.selectedPlan.exerciseSets.map(set => set.id);
    this.databaseProvider.addExerciseSetsToWorkoutPlan(this.selectedPlan.id, exerciseIds);
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
