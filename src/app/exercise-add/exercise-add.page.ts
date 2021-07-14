import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-exercise-add',
  templateUrl: './exercise-add.page.html',
  styleUrls: ['./exercise-add.page.scss'],
})
export class ExerciseAddPage implements OnInit {
  workouts: Array<WorkoutAdd>  = Array(new WorkoutAdd("first", false), new WorkoutAdd("second", false), new WorkoutAdd("third", false))

  constructor() {
  }

  ngOnInit() {
  }

}

export class WorkoutAdd {
  constructor(public title: string, public isChecked: boolean) {}
}
