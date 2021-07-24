import { DatabaseProvider } from './../database-provider';
import { WorkoutPlanRepositoryService } from './../workout-plan-repository.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { SingleExerciseSet, WorkoutPlan } from '../model/workout-plan';
import { Location } from '@angular/common';
import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-workout-run',
  templateUrl: './workout-run.page.html',
  styleUrls: ['./workout-run.page.scss'],
})
export class WorkoutRunPage implements OnInit {
  selectedPlan: WorkoutPlan = new WorkoutPlan('', '','', []);
  options: AnimationOptions = {
    path: '/assets/fitness.json',
  };

  constructor(
    public toastController: ToastController,
      private activatedRoute: ActivatedRoute,
      private location: Location,
      private databaseProvider: DatabaseProvider,
      private workoutPlanRepositoryService: WorkoutPlanRepositoryService) { }

  ngOnInit() {
    const planId = this.activatedRoute.snapshot.paramMap.get('id');
    this.selectedPlan = this.workoutPlanRepositoryService.allWorkoutPlans.find(p => p.id === planId);
    this.selectedPlan.exerciseSets.forEach(item => {
        item.exerciseSets.forEach(set => {
          set.finished = false;
        });
    });
  }

  async save() {
    const toast = await this.toastController.create({
      message: 'Workout finished!',
      duration: 2000
    });
    toast.present();
    this.location.back();
    const workoutRun = new WorkoutRun();
    workoutRun.executedPlan = this.selectedPlan.title;
    workoutRun.executedExercises = Array();
    this.selectedPlan.exerciseSets.forEach(item => {
      const executedExercise = new ExecutedExercise();
      executedExercise.set = new Array();
      executedExercise.exercise = item.exercise.title;
      workoutRun.executedExercises.push(executedExercise);
      item.exerciseSets.forEach(set => {
        if (set.finished) {
          executedExercise.set.push(set);
        }
      });
    });
    this.databaseProvider.addWorkoutRun(workoutRun);
  }
}

export class WorkoutRun {
  date: any;
  user: string;
  executedPlan: string;
  executedExercises: Array<ExecutedExercise>;
}

export class ExecutedExercise {
  exercise: string;
  set: Array<SingleExerciseSet>;
}
