import { DatabaseProvider } from './../database-provider';
import { Component, OnInit } from '@angular/core';
import { WorkoutPlan } from '../model/workout-plan';

@Component({
  selector: 'app-workout-overview',
  templateUrl: './workout-overview.page.html',
  styleUrls: ['./workout-overview.page.scss'],
})
export class WorkoutOverviewPage implements OnInit {

  constructor(private databaseProvider: DatabaseProvider) { }

  ngOnInit() {

  }

  ionViewWillEnter(){
    this.receiveWorkoutPlans();
  }

  receiveWorkoutPlans(): Promise<WorkoutPlan[]> {
    return new Promise((resolve) => {
      this.databaseProvider.getWorkoutPlans().then((data) => {
        resolve(data);
      });
    });
  }

}
