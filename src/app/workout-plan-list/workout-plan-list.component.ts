import { DatabaseProvider } from './../database-provider';
import { WorkoutPlanRepositoryService } from './../workout-plan-repository.service';
import { Component, OnInit } from '@angular/core';
import { WorkoutPlan } from '../workout-plan';

@Component({
  selector: 'app-workout-plan-list',
  templateUrl: './workout-plan-list.component.html',
  styleUrls: ['./workout-plan-list.component.scss'],
})
export class WorkoutPlanListComponent implements OnInit {
  workoutPlans: Array<WorkoutPlan>  = Array()


  constructor(public workoutPlanRepositoryService: WorkoutPlanRepositoryService,
    private databaseProvider: DatabaseProvider) {
    
  }

  ngOnInit() {
    this.initData()
  }

  initData() {
    this.databaseProvider.getDocuments("WorkoutPlan").then(data => {
      debugger
      this.workoutPlans = data
      let test = this.workoutPlans
    })
  }

  

}
