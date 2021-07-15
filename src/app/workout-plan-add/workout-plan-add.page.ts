import { AddExerciseService } from './../add-exercise.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-workout-plan-add',
  templateUrl: './workout-plan-add.page.html',
  styleUrls: ['./workout-plan-add.page.scss'],
})
export class WorkoutPlanAddPage implements OnInit {

  constructor(public addExerciseService: AddExerciseService) { }

  ngOnInit() {
  }

}
