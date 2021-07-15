import { WorkoutPlanRepositoryService } from './../workout-plan-repository.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WorkoutPlan } from '../model/workout-plan';

@Component({
  selector: 'app-workout-plan-detail',
  templateUrl: './workout-plan-detail.page.html',
  styleUrls: ['./workout-plan-detail.page.scss'],
})
export class WorkoutPlanDetailPage implements OnInit {
  selectedPlan: WorkoutPlan = new WorkoutPlan('', '', '', [])

  constructor(public activatedRoute: ActivatedRoute,
    private workoutPlanRepositoryService: WorkoutPlanRepositoryService) { }

  ngOnInit() {
    const planId = this.activatedRoute.snapshot.paramMap.get('id');
    this.selectedPlan = this.workoutPlanRepositoryService.allWorkoutPlans.find(p => p.id === planId);
  }

}
