import { TranslateService } from '@ngx-translate/core';
import { WorkoutRun } from './../workout-run/workout-run.page';
import { DatabaseProvider } from './../database-provider';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  NgZone,
  OnInit,
  ViewChild,
} from '@angular/core';
import { GoogleChartInterface } from 'ng2-google-charts';
import { DatePipe } from '@angular/common';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.page.html',
  styleUrls: ['./progress.page.scss'],
})
export class ProgressPage implements OnInit {
  @ViewChild('mychart ', { static: false }) mychart;
  @ViewChild('lineChart') lineCanvas: ElementRef;

  public workoutRuns: Array<WorkoutRun>;
  public pieChart: GoogleChartInterface;

  period: Period;
  type: string;
  loaded = false;
  exercises: string[] = Array();
  selectedExercises: string[] = Array();

  private lineChart: Chart;

  constructor(
    private translateService: TranslateService,
    private changeDetectorRef: ChangeDetectorRef,
    private databaseProvider: DatabaseProvider,
    private datePipe: DatePipe
  ) {
    Chart.register(...registerables);
  }

  ngOnInit() {
    this.type = 'list';
    this.period = Period.week;
    this.databaseProvider.onWorkoutRunsChanged.subscribe(workoutRuns => {
      this.workoutRuns = workoutRuns;

      this.initializeExerciseList(workoutRuns);
      this.createGroupLineChart();
      this.loaded = true;
    });
  }

  ionViewWillEnter() {
    this.receiveAllWorkoutRuns();
  }

  createGroupLineChart() {
    this.lineChart = new Chart(this.lineCanvas?.nativeElement, {
      type: 'line',
      data: {
        labels: this.createAxisLabels(),
        datasets: this.createDataSets(),
      },
      options: {
        scales: {
          /* yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }] */
        },
      },
    });
  }

  createDataSets(): any[] {
    const dataSets = Array();
    this.selectedExercises.forEach((selectedExercise) => {
      const data = this.createData(selectedExercise);
      this.translateService.get(selectedExercise).subscribe(trans => {
        const dataSet = this.createDataSet(trans, data);
        dataSets.push(dataSet);
      });
    });
    return dataSets;
  }

  createData(title: string): any[] {
    const days = this.periodToDay(this.period);
    const dataArray = Array();

    for (let i = 0; i < days + 1; i++) {
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - days + i);

      const exercises = this.workoutRuns.filter((item) =>
        item.executedExercises.filter((e) => e.exercise === title)
      );
      const exercise = exercises.find(
        (bla) =>
          bla.date.toDate().getFullYear() === daysAgo.getFullYear() &&
          bla.date.toDate().getMonth() === daysAgo.getMonth() &&
          bla.date.toDate().getDate() === daysAgo.getDate()
      );
      if (exercise != null) {
        const lastExecutedExercise = exercise.executedExercises.find(
          (item) => item.exercise === title
        );
        if (lastExecutedExercise != null) {
          let volume = 0;
          lastExecutedExercise.set.forEach((set) => {
            if (set.time != null) {
              volume = volume + set.time;
            } else {
              let weight = set.weight;
              if (set.weight === 0) {
                weight = 1;
              }
              volume = volume + set.reps * weight;
            }

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
      } else {
        if (dataArray.length > 0) {
          dataArray.push(dataArray[dataArray.length - 1]);
        } else {
          dataArray.push(0);
        }
      }
    }

    return dataArray;
  }

  createDataSet(title: string, data: number[]): any {
    return {
      label: title,
      data,
      borderColor: this.getRandomColor(),
      borderWidth: 1,
    };
  }

  getRandomColor() {
    const colors = [
      '#0074d9',
      '#7fdbff',
      '#39cccc',
      '#3d9970',
      '#2ecc40',
      '#01ff70',
      '#ffdc00',
      '#ff851b',
      '#ff4136',
      '#85144b',
      '#f012be',
      '#b10dc9',
      '#aaaaaa',
      '#dddddd',
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  addData(chart, label, data) {
    chart.data.labels.push(label);
    chart.data.datasets.forEach((dataset) => {
      dataset.data.push(data);
    });
    chart.update();
  }

  segmentChanged($event) {
    this.type = $event.detail.value;
    this.changeDetectorRef.markForCheck();
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
    this.lineChart.destroy();
    this.createGroupLineChart();
    this.lineChart.update();
  }

  private receiveAllWorkoutRuns() {
    this.databaseProvider.receiveAllWorkoutRuns().then((item) => {
      this.workoutRuns = item;
      this.initializeExerciseList(item);
      this.createGroupLineChart();
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
    if (this.exercises.length > 0) {
      this.selectedExercises.push(this.exercises[0]);
    }
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

  private createAxisLabels(): string[] {
    const days = this.periodToDay(this.period);
    const dateArray = Array();
    for (let i = 0; i < days + 1; i++) {
      const newDate = new Date();
      newDate.setDate(newDate.getDate() - days + i);
      const formattedDate = this.datePipe.transform(newDate, 'dd.MM.yyyy');
      dateArray.push(formattedDate);
    }
    return dateArray;
  }

  private createDataArray(workoutRuns: WorkoutRun[]): string[] {
    const days = this.periodToDay(this.period);
    const dataRow = Array();
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - days);
    for (let i = 0; i < days + 1; i++) {
      const newDate = new Date();
      newDate.setDate(daysAgo.getDate() + i);
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
              if (set.time !== undefined && set.time !== null) {
                volume = volume + set.time;
              } else {
                let weight = set.weight;
                if (set.weight === 0) {
                  weight = 1;
                }
                volume = volume + set.reps * weight;
              }
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
      options: {
        width: 411,
        height: 300,
        backgroundColor: 'transparent',
        curveType: 'function',
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
