import { Component, Input, OnInit } from '@angular/core';
import { ExerciseSet } from '../../model/workout-plan';

@Component({
  selector: 'app-workout-run-item',
  templateUrl: './workout-run-item.component.html',
  styleUrls: ['./workout-run-item.component.scss'],
})
export class WorkoutRunItemComponent implements OnInit {
  @Input() exerciseSet: ExerciseSet;

  constructor() { }

  ngOnInit() {}

}
