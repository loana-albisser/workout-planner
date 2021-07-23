import { WorkoutRun, ExecutedExercise } from './../workout-run/workout-run.page';
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
  public workoutRuns: Array<WorkoutRun>;
  public pieChart: GoogleChartInterface;

  type: string;
  loaded = false;

  constructor(private databaseProvider: DatabaseProvider) {}

  ngOnInit() {
    this.type = 'list';
  }

  ionViewWillEnter(){
    this.receiveAllWorkoutRuns();
  }

  segmentChanged($event) {
    this.type = $event.detail.value;
  }

  isListLayout() {
    return this.type === 'list';
  }

  isEmpty(): boolean {
    if (this.workoutRuns == null) {
      return true;
    }
    return this.workoutRuns.length === 0;
  }

  private receiveAllWorkoutRuns() {
    this.databaseProvider.receiveAllWorkoutRuns().then(item => {
        this.workoutRuns = item;
        this.loadChart();
        this.loaded = true;
    });
  }

  private createDatatable(): any[] {
    const dataTable = Array();
    const allExecutedExercises = Array();
    this.workoutRuns.forEach(item => {
      item.executedExercises.forEach(executedExercise => {
        allExecutedExercises.push(executedExercise);
       });
    });

    dataTable.push(this.createTitleArray());
    /* allExecutedExercises.forEach(item => {
      dataTable.push(this.createDataArray(item));
    }); */
    this.workoutRuns.forEach(item => {
        dataTable.push(this.createDataArray(item))
    });


    return dataTable;
  }

  private createDataArray(item: WorkoutRun): string[] {
    const dataRow = Array();
    dataRow.push(item.date.toDate(), '');

    return dataRow;

  }

  private createTitleArray(): string[] {
   const titleRow = Array();
   titleRow.push('Day');
   const allExecutedExercises = Array();
   this.workoutRuns.forEach(item => {
     item.executedExercises.forEach(executedExercise => {
      allExecutedExercises.push(executedExercise.exercise);
     });
   });

   /* allExecutedExercises.forEach(item => {
    titleRow.push(item);
   }); */
   titleRow.push(allExecutedExercises[0]);
   return titleRow;
  }

  private loadChart() {
    if (this.workoutRuns != null) {
      const executedExercises = this.workoutRuns[0].executedExercises;
    }
    this.pieChart = {
      chartType: 'LineChart',
      /* dataTable: [
        ['Day', 'Vertical Traction', 'Back Extenstion'],
        ['1', 20, 10],
        ['2', 20, 10],
        ['3', 20, 10],
        ['4', 25, 10],
        ['5', 25, 10],
        ['6', 30, 15],
        ['7', 25, 20]
      ], */
      dataTable: this.createDatatable(),
      //opt_firstRowIsData: true,
      options: {
        // backgroundColor: 'transparent',
        title: 'Exercises',
        curveType: 'function',
        legend: { position: 'bottom' },
      },
    };
  }

}
