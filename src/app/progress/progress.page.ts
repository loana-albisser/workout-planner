import {
  WorkoutRun,
  ExecutedExercise,
} from './../workout-run/workout-run.page';
import { DatabaseProvider } from './../database-provider';
import { Component, OnInit } from '@angular/core';
import { GoogleChartInterface } from 'ng2-google-charts';
import { DatePipe } from '@angular/common';
import { Exercise } from '../model/workout-plan';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.page.html',
  styleUrls: ['./progress.page.scss'],
})
export class ProgressPage implements OnInit {
  public workoutRuns: Array<WorkoutRun>;
  public pieChart: GoogleChartInterface;

  period: Period;
  type: string;
  loaded = false;
  exercises: string[] = Array();
  selectedExercises: string[] = Array();

  constructor(
    private databaseProvider: DatabaseProvider,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {
    this.type = 'list';
    this.period = Period.week;
  }

  ionViewWillEnter() {
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
    this.databaseProvider.receiveAllWorkoutRuns().then((item) => {
      this.workoutRuns = item;
      this.loadChart();
      this.loaded = true;
      this.initializeExerciseList(item);
    });
  }

  private initializeExerciseList(workoutRuns: WorkoutRun[]) {
    workoutRuns.forEach((workoutRun) => {
      workoutRun.executedExercises.forEach((ex) => {
        if (
          this.exercises.find((exercise) => exercise === ex.exercise) == null
        ) {
          this.exercises.push(ex.exercise);
        }
      });
    });
    this.selectedExercises.push(this.exercises[0]);
  }

  private createDatatable(): any[] {
    const dataTable = Array();
    const allExecutedExercises = Array();
    this.workoutRuns.forEach((item) => {
      item.executedExercises.forEach((executedExercise) => {
        allExecutedExercises.push(executedExercise);
      });
    });

    dataTable.push(this.createTitleArray());
    /* allExecutedExercises.forEach(item => {
      dataTable.push(this.createDataArray(item));
    }); */
    this.createDataArray(this.workoutRuns).forEach((item) => {
      dataTable.push(item);
    });
    // dataTable.push(this.createDataArray(this.workoutRuns));

    return dataTable;
  }

  private createDataArray(workoutRuns: WorkoutRun[]): string[] {
    const dataRow = Array();
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const exercises = workoutRuns.filter((item) =>
      item.executedExercises.filter((bla) => bla.exercise === 'Train triangle')
    );
    for (let i = 0; i < 8; i++) {
      const newDate = new Date();
      newDate.setDate(weekAgo.getDate() + i);
      const formattedDate = this.datePipe.transform(newDate, 'dd.MM.yyyy');
      let exercise = exercises.find((bla) => bla.date.toDate() >= newDate);
      if (exercise == null) {
        exercise = exercises.find((bla) => bla.date.toDate() < newDate);
      }
      if (exercise != null) {
        const lastExecutedExercise = exercise.executedExercises.find(
          (item) => item.exercise === 'Train triangle'
        );
        let volume = 0;
        lastExecutedExercise.set.forEach((set) => {
          let weight = set.weight;
          if (set.weight === 0) {
            weight = 1;
          }
          volume = volume + set.reps * weight;
        });

        dataRow.push([formattedDate, volume]);
      }
    }

    return dataRow;
  }

  private createTitleArray(): string[] {
    const titleRow = Array();
    titleRow.push('Day');
    const allExecutedExercises = Array();
    this.workoutRuns.forEach((item) => {
      item.executedExercises.forEach((executedExercise) => {
        allExecutedExercises.push(executedExercise.exercise);
      });
    });
    allExecutedExercises.forEach(item => {
      titleRow.push(item);
    });
    debugger;
    // titleRow.push(allExecutedExercises[0]);
    return titleRow;
  }

  private loadChart() {
    if (this.workoutRuns != null) {
      const executedExercises = this.workoutRuns[0].executedExercises;
    }
    this.pieChart = {
      chartType: 'LineChart',
      dataTable: this.createDatatable(),
      //opt_firstRowIsData: true,
      options: {
        width: 411,
        height: 300,
        backgroundColor: 'transparent',
        // title: 'Exercises',
        curveType: 'function',
        // chartArea: {  width: "100%", height: "120%" },
        legend: { position: 'bottom', textStyle: { color: '#FFFFFF' } },
        hAxis: {
          textStyle: {
            color: '#FFFFFF',
            opacity: 0.7,
          },
          gridlines: {
            color: 'red',
          },
          ticks: [1, 3, 6, 8],
        },
        vAxis: {
          textStyle: {
            color: '#FFFFFF',
            opacity: 0.7,
          },
        },
        /* titleTextStyle: {
          color: '#FFFFFF',
        } */
      },
    };
  }
}

enum Period {
  week = 'week',
  month = 'month',
  threeMonth = 'threeMonth',
  sixMonth = 'sixMonth',
  year = 'year',
  all = 'all',
}
