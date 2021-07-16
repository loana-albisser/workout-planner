import { DatabaseProvider } from './../database-provider';
import { WorkoutPlanRepositoryService } from './../workout-plan-repository.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkoutPlan } from '../model/workout-plan';
import { Location } from '@angular/common';
import { AddExerciseService } from '../add-exercise.service';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-workout-plan-detail',
  templateUrl: './workout-plan-detail.page.html',
  styleUrls: ['./workout-plan-detail.page.scss'],
})
export class WorkoutPlanDetailPage implements OnInit {
  selectedPlan: WorkoutPlan = new WorkoutPlan('', '', '', []);

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    public activatedRoute: ActivatedRoute,
    private databaseProvider: DatabaseProvider,
    public addExerciseService: AddExerciseService,
    private workoutPlanRepositoryService: WorkoutPlanRepositoryService
  ) {}

  ngOnInit() {
    const planId = this.activatedRoute.snapshot.paramMap.get('id');
    this.selectedPlan = this.workoutPlanRepositoryService.allWorkoutPlans.find(
      (p) => p.id === planId
    );
  }

  saveWorkoutPlan() {
    this.selectedPlan.exerciseSets.forEach((sets) => {
      this.databaseProvider.updateExerciseSet(sets.id, sets.exerciseSets);
    });
    this.addExerciseService.exerciseAddSetList.forEach((sets) => {
      this.databaseProvider.addExerciseSet(sets).then((result) => {
        this.databaseProvider.addExerciseSetToWorkoutPlan(
          this.selectedPlan.id,
          result
        );
      });
    });
    this.router.navigate([
      '/home',
      { uid: this.authenticationService.currentUser },
    ]);
  }
}
