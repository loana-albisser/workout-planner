import { WorkoutRun } from './../../workout-run/workout-run.page';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-progress-item',
  templateUrl: './progress-item.component.html',
  styleUrls: ['./progress-item.component.scss'],
})
export class ProgressItemComponent implements OnInit {
  @Input() workoutRun: WorkoutRun;
  expanded = false;

  constructor() { }

  ngOnInit() {}

  changeExpandItem() {
    this.expanded = !this.expanded;
  }

}
