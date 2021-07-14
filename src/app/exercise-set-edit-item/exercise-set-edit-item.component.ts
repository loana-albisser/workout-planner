import { ExerciseSet } from './../model/workout-plan';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-exercise-set-edit-item',
  templateUrl: './exercise-set-edit-item.component.html',
  styleUrls: ['./exercise-set-edit-item.component.scss'],
})
export class ExerciseSetEditItemComponent implements OnInit {
  @Input() exerciseSet: ExerciseSet

  constructor() { 
  }

  ngOnInit() {
  }

}
