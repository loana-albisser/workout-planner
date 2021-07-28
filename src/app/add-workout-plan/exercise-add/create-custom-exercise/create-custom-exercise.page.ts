import { DatabaseProvider } from './../../../database-provider';
import { Component, OnInit } from '@angular/core';
import { MuscleGroupFilter } from '../exercise-add.page';
import { Location, DatePipe, DecimalPipe } from '@angular/common';
import { PickerOptions } from '@ionic/core';
import { PickerController } from '@ionic/angular';

@Component({
  selector: 'app-create-custom-exercise',
  templateUrl: './create-custom-exercise.page.html',
  styleUrls: ['./create-custom-exercise.page.scss'],
})
export class CreateCustomExercisePage implements OnInit {
  title: string;
  repetitions: string;
  weight: string;
  timeInSeconds: number;
  timeAsString: string;
  unit: UnitEnum;
  exerciseType: ExerciseTypeEnum;
  muscleGroups: Array<MuscleGroupFilter> = Array();

  constructor(
    private decimalPipe: DecimalPipe,
    private location: Location,
    private pickerController: PickerController,
    private databaseProvider: DatabaseProvider
  ) {}

  ngOnInit() {
    this.initializeMuscleGroups();
    this.unit = UnitEnum.weight;
    this.exerciseType = ExerciseTypeEnum.none;
  }

  saveExercise() {
    this.location.back();
  }

  async openPicker() {
    const options: PickerOptions = {
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Ok',
          handler: (value: any) => {
            const hours = value.hours.value;
            const minutes = value.minutes.value;
            const seconds = value.seconds.value;
            this.timeInSeconds = (hours * 60 * 60) + (minutes * 60) + seconds;

            this.timeAsString = this.decimalPipe.transform(hours, '2.0-0') + ':'
            + this.decimalPipe.transform(minutes, '2.0-0') + ':'
            + this.decimalPipe.transform(seconds, '2.0-0')
            ;
          },
        },
      ],
      columns: this.getColumns(),
    };
    const picker = await this.pickerController.create(options);
    picker.present();
  }

  getColumns() {
    const columns = [];
    columns.push({
      name: 'hours',
      options: this.getColumnOptions(),
    });
    columns.push({
      name: 'minutes',
      options: this.getColumnOptions(),
    });
    columns.push({
      name: 'seconds',
      options: this.getColumnOptions(),
    });
    return columns;
  }
  getColumnOptions() {
    const options = [];
    for (let i = 0; i < 60; i++) {
      options.push({
        text: this.decimalPipe.transform(i, '2.0-0'),
        value: i,
      });
    }
    return options;
  }

  selectTime(event: any) {
    const test = event;
  }

  isUnitWeight(): boolean {
    return this.unit === UnitEnum.weight;
  }

  initializeMuscleGroups() {
    this.databaseProvider.receiveMuscleGroups().then((result) => {
      result.forEach((item) => {
        this.muscleGroups.push(new MuscleGroupFilter(item.id, item.title));
      });
    });
  }
}

enum UnitEnum {
  weight = 'weight',
  timer = 'time',
}

enum ExerciseTypeEnum {
  machine = 'machine',
  bodyWeight = 'bodyWeight',
  none = 'none',
}
