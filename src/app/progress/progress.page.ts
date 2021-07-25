import { WorkoutRun } from './../workout-run/workout-run.page';
import { DatabaseProvider } from './../database-provider';
import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { GoogleChartInterface } from 'ng2-google-charts';
import { DatePipe } from '@angular/common';

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
  @ViewChild('mychart ', { static: false }) mychart;

  constructor(
    private databaseProvider: DatabaseProvider,
    private datePipe: DatePipe,
    private zone: NgZone
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

  updateGraph() {
    this.pieChart.dataTable = this.createDatatable();
    this.mychart.draw();
  }

  private receiveAllWorkoutRuns() {
    this.databaseProvider.receiveAllWorkoutRuns().then((item) => {
      this.workoutRuns = item;
      this.initializeExerciseList(item);
      this.loadChart();
      this.loaded = true;
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
    this.createDataArray(this.workoutRuns).forEach((item) => {
      dataTable.push(item);
    });
    return dataTable;
  }

  private periodToDay(period: Period): number {
    if (period === Period.week) {
      return 7;
    } else if (period === Period.month) {
      return 30;
    } else if (period === Period.threeMonth) {
      return 60;
    } else if (period === Period.sixMonth) {
      return 90;
    } else if (period === Period.year) {
      return 365;
    } else {
      return 365;
    }
  }

  private createDataArray(workoutRuns: WorkoutRun[]): string[] {
    const days = this.periodToDay(this.period);
    const dataRow = Array();
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - days);
    for (let i = 0; i < days + 1; i++) {
      const newDate = new Date();
      newDate.setDate(weekAgo.getDate() + i);
      const formattedDate = this.datePipe.transform(newDate, 'dd.MM.yyyy');
      const dataArray = Array();
      dataArray.push(formattedDate);
      this.selectedExercises.forEach((selectedExercise) => {
        const exercises = workoutRuns.filter((item) =>
          item.executedExercises.filter(
            (bla) => bla.exercise === selectedExercise
          )
        );
        let exercise = exercises.find((bla) => bla.date.toDate() >= newDate);
        if (exercise == null) {
          exercise = exercises.find((bla) => bla.date.toDate() < newDate);
        }
        if (exercise != null) {
          const lastExecutedExercise = exercise.executedExercises.find(
            (item) => item.exercise === selectedExercise
          );
          if (lastExecutedExercise != null) {
            let volume = 0;
            lastExecutedExercise.set.forEach((set) => {
              let weight = set.weight;
              if (set.weight === 0) {
                weight = 1;
              }
              volume = volume + set.reps * weight;
            });
            dataArray.push(volume);
          } else {
            if (dataArray.length > 1) {
              const lastElement = dataArray[dataArray.length - 1];
              dataArray.push(lastElement);
            } else {
              dataArray.push(0);
            }
          }
        }
      });

      dataRow.push(dataArray);
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
    this.selectedExercises.forEach((item) => {
      titleRow.push(item);
    });
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
