import { Title } from '@angular/platform-browser';
import { Exercise } from './../model/workout-plan';
import { DatabaseProvider } from './../database-provider';
import { WorkoutPlanRepositoryService } from './../workout-plan-repository.service';
import { Component, OnInit } from '@angular/core';
import { WorkoutPlan } from '../model/workout-plan';

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

  async initData() {
    this.receiveAll().then(result => {
      this.workoutPlans = result
    })
  }

  async receiveAll(): Promise<WorkoutPlan[]> {
    var workoutPlans: WorkoutPlan[] = Array()
    return new Promise(resolve => {
      this.receiveWorkoutPlans().then(data => {
        this.updateWorkoutPlans(data).then(data => {
            this.workoutPlans = data
        })
        
      })
    })
  }

  async updateWorkoutPlans(data: WorkoutPlan[]): Promise<WorkoutPlan[]> {
    let workoutPlans: WorkoutPlan[] = Array()
    for (let workoutPlan of data) {
      let newWorkoutPlan = new WorkoutPlan()
      Object.assign(newWorkoutPlan, workoutPlan)
      newWorkoutPlan.exercises = Array()
      for (let exercise of workoutPlan.exercises) {
        const newExercise = await this.databaseProvider.getExercise(exercise.id)
        newWorkoutPlan.exercises.push(newExercise)
      }
      workoutPlans.push(newWorkoutPlan)
      
    }
    return workoutPlans
  }

  async receiveWorkoutPlans(): Promise<WorkoutPlan[]> {
    return new Promise(resolve => {
      this.databaseProvider.getWorkoutPlans("WorkoutPlan").then(data => {
        resolve(data)
      })
    })
  }

  async receiveExercise(id: string): Promise<Exercise> {
    return new Promise(resolve => {
      this.databaseProvider.getExercise(id).then(data => {
        resolve(data)

    })
    })
  }
}
