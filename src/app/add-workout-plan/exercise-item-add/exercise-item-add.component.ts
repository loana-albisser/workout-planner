import { Exercise, ExerciseSet } from '../../model/workout-plan';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-exercise-item-add',
  templateUrl: './exercise-item-add.component.html',
  styleUrls: ['./exercise-item-add.component.scss'],
})
export class ExerciseItemAddComponent implements OnInit {
  @Input() exerciseSet: ExerciseSet;

  constructor() { }

  ngOnInit() {}

}
