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
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-workout-plan-detail',
  templateUrl: './workout-plan-detail.page.html',
  styleUrls: ['./workout-plan-detail.page.scss'],
})
export class WorkoutPlanDetailPage implements OnInit {
  selectedPlan: WorkoutPlan = new WorkoutPlan('', '', '', false, false, []);
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
    this.addExerciseService.exerciseAddSetList = Array();
    this.addExerciseService.removedExercises = Array();
    this.title = this.selectedPlan.title;
  }

  ionViewWillEnter(){
    this.addExerciseService.exerciseAddSetList.forEach(item => {
      if (!this.selectedPlan.exerciseSets.includes(item)){
        this.selectedPlan.exerciseSets.push(item);
      }
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
    this.move(this.selectedPlan.exerciseSets, event.detail.from, event.detail.to);
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

  hasElements(sets: ExerciseSet): boolean {
    let hasElements = false;
      if (sets.exercise.unit === UnitEnum.timer) {
        let totalTime = 0;
        sets.exerciseSets.forEach(item => {
          totalTime += item.time;
        });
        if (totalTime === null || totalTime === undefined || totalTime === 0) {
          hasElements = false;
        } else {
          hasElements = true;
        }
      } else {
        let total = 0;
        sets.exerciseSets.forEach(item => {
          total += (item.weight * item.reps);
        });
        if (total === null || total === undefined || total === 0) {
          hasElements = false;
        } else {
          hasElements = true;
        }
      }
      return hasElements;
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

      if (this.hasElements(sets)) {
        const singleExerciseSet = new ExerciseSet('', sets.exercise, sets.exerciseSets);
      await this.databaseProvider.addExerciseSet(singleExerciseSet).then(async data => {
        this.selectedPlan.exerciseSets.find(item => item === sets).id = data;
        const exerciseIds = this.selectedPlan.exerciseSets.filter(set => set.id !== '0').map(set => set.id);
        this.databaseProvider.addExerciseSetsToWorkoutPlan(this.selectedPlan.id, exerciseIds);
      });
      }

    });
    this.addExerciseService.removedExercises.forEach(async set => {
      await this.databaseProvider.removeExerciseSet(set);
      await this.databaseProvider.removeExerciseSetFromWorkoutPlan(this.selectedPlan.id, set.id);
    });
    const ids = this.selectedPlan.exerciseSets.filter(set => set.id !== '0').map(set => set.id);
    this.databaseProvider.addExerciseSetsToWorkoutPlan(this.selectedPlan.id, ids);
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
