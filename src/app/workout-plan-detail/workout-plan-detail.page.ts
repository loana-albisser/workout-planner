import { DatabaseProvider } from './../database-provider';
import { WorkoutPlanRepositoryService } from './../workout-plan-repository.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WorkoutPlan } from '../model/workout-plan';
import { Location } from '@angular/common';

@Component({
  selector: 'app-workout-plan-detail',
  templateUrl: './workout-plan-detail.page.html',
  styleUrls: ['./workout-plan-detail.page.scss'],
})
export class WorkoutPlanDetailPage implements OnInit {
  selectedPlan: WorkoutPlan = new WorkoutPlan('', '', '', []);

  constructor(
    private location: Location,
    public activatedRoute: ActivatedRoute,
    private databaseProvider: DatabaseProvider,
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
    this.location.back();
  }
}
