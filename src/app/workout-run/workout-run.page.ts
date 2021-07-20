import { DatabaseProvider } from './../database-provider';
import { WorkoutPlanRepositoryService } from './../workout-plan-repository.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { SingleExerciseSet, WorkoutPlan } from '../model/workout-plan';
import { Location } from '@angular/common';

@Component({
  selector: 'app-workout-run',
  templateUrl: './workout-run.page.html',
  styleUrls: ['./workout-run.page.scss'],
})
export class WorkoutRunPage implements OnInit {
  selectedPlan: WorkoutPlan = new WorkoutPlan('', '','', []);

  constructor(
      private activatedRoute: ActivatedRoute,
      private location: Location,
      private databaseProvider: DatabaseProvider,
      private workoutPlanRepositoryService: WorkoutPlanRepositoryService) { }

  ngOnInit() {
    const planId = this.activatedRoute.snapshot.paramMap.get('id');
    this.selectedPlan = this.workoutPlanRepositoryService.allWorkoutPlans.find(p => p.id === planId);
  }

  save() {
    this.location.back();
    const workoutRun = new WorkoutRun();
    workoutRun.executedExercised = Array();
    this.selectedPlan.exerciseSets.forEach(item => {
      const executedExercise = new ExecutedExercise();
      executedExercise.set = new Array();
      executedExercise.exerciseSetId = item.id;
      workoutRun.executedExercised.push(executedExercise);
      item.exerciseSets.forEach(set => {
        if (set.finished) {
          executedExercise.set.push(set);
          // finishedExercises.push(set);
        }
      });
    });
    this.databaseProvider.addWorkoutRun(workoutRun);
  }
}

export class WorkoutRun {
  date: any;
  executedExercised: Array<ExecutedExercise>;
}

export class ExecutedExercise {
  exerciseSetId: string;
  set: Array<SingleExerciseSet>;
}
