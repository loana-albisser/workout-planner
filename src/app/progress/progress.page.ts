import { WorkoutRun } from './../workout-run/workout-run.page';
import { DatabaseProvider } from './../database-provider';
import Chart from 'chart.js/auto';
import { Component, OnInit } from '@angular/core';
import { GoogleChartInterface } from 'ng2-google-charts';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.page.html',
  styleUrls: ['./progress.page.scss'],
})
export class ProgressPage implements OnInit {
  public pieChart: GoogleChartInterface;
  public workoutRuns: Array<WorkoutRun>;

  constructor(private databaseProvider: DatabaseProvider) {}

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.receiveAllWorkoutRuns();

  }

  private receiveAllWorkoutRuns() {
    this.databaseProvider.receiveAllWorkoutRuns().then(item => {
        this.workoutRuns = item;
    });
  }
}
