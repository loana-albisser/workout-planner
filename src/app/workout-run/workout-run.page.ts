import { DatabaseProvider } from './../database-provider';
import { WorkoutPlanRepositoryService } from './../workout-plan-repository.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { SingleExerciseSet, WorkoutPlan } from '../model/workout-plan';
import { Location } from '@angular/common';
import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';
import { ToastController } from '@ionic/angular';
import {
  ExerciseTypeEnum,
  UnitEnum,
} from '../add-workout-plan/exercise-add/create-custom-exercise/create-custom-exercise.page';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-workout-run',
  templateUrl: './workout-run.page.html',
  styleUrls: ['./workout-run.page.scss'],
})
export class WorkoutRunPage implements OnInit {
  selectedPlan: WorkoutPlan = new WorkoutPlan('', '', '', false, false, []);
  options: AnimationOptions = {
    path: '/assets/fitness.json',
  };
  runTimer: boolean;
  remainingTime = 0;
  displayTime: string;

  constructor(
    public toastController: ToastController,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private translateService: TranslateService,
    private databaseProvider: DatabaseProvider,
    private workoutPlanRepositoryService: WorkoutPlanRepositoryService
  ) {}

  ngOnInit() {
    const planId = this.activatedRoute.snapshot.paramMap.get('id');
    this.selectedPlan = this.workoutPlanRepositoryService.allWorkoutPlans.find(
      (p) => p.id === planId
    );
    this.selectedPlan.exerciseSets.forEach((item) => {
      item.exerciseSets.forEach((set) => {
        set.finished = false;
      });
    });
  }

  startTimer() {
    this.runTimer = true;
    this.timerTick();
  }

  stopTimer() {
    this.runTimer = false;
    this.remainingTime = 0;
    this.displayTime = '00:00:00';
  }

  timerTick() {
    setTimeout(() => {
      if (!this.runTimer) {
        return;
      }
      this.remainingTime++;
      this.displayTime = this.getSecondsAsDigitalClock(this.remainingTime);
      if (this.remainingTime > 0) {
        this.timerTick();
      }
    }, 1000);
  }

  getSecondsAsDigitalClock(inputSeconds: number) {
    const secNum = parseInt(inputSeconds.toString(), 10);
    const hours = Math.floor(secNum / 3600);
    const minutes = Math.floor((secNum - hours * 3600) / 60);
    const seconds = secNum - hours * 3600 - minutes * 60;
    let hoursString = '';
    let minutesString = '';
    let secondsString = '';
    hoursString = hours < 10 ? '0' + hours : hours.toString();
    minutesString = minutes < 10 ? '0' + minutes : minutes.toString();
    secondsString = seconds < 10 ? '0' + seconds : seconds.toString();
    return hoursString + ':' + minutesString + ':' + secondsString;
  }

  async save() {
    this.translateService.get('workoutFinished').subscribe(async (value) => {
      const toast = await this.toastController.create({
        message: value,
        duration: 2000,
      });
      toast.present();
    });
    this.location.back();
    const workoutRun = new WorkoutRun();
    workoutRun.executedPlan = this.selectedPlan.title;
    workoutRun.executedExercises = Array();
    this.selectedPlan.exerciseSets.forEach((item) => {
      const executedExercise = new ExecutedExercise();
      executedExercise.set = new Array();
      executedExercise.exercise = item.exercise.title;
      workoutRun.executedExercises.push(executedExercise);
      item.exerciseSets.forEach((set) => {
        if (set.finished) {
          if (item.exercise.unit !== UnitEnum.timer) {
            delete set.time;
          }
          executedExercise.set.push(set)
        }
      });
      if (executedExercise.set.length > 0) {
        this.databaseProvider.updateExerciseSet(item.id, item.exerciseSets, item.markToImprove);
      }
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
  markToImprove: boolean;
}
