import { Title } from '@angular/platform-browser';
import { Exercise, WorkoutPlan } from './../model/workout-plan';
import { DatabaseProvider } from './../database-provider';
import { WorkoutPlanRepositoryService } from './../workout-plan-repository.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-workout-plan-list',
  templateUrl: './workout-plan-list.component.html',
  styleUrls: ['./workout-plan-list.component.scss'],
})
export class WorkoutPlanListComponent implements OnInit {
  workoutPlans: Array<WorkoutPlan>  = Array()


  constructor(
    public router: Router,
    public workoutPlanRepositoryService: WorkoutPlanRepositoryService,
    private databaseProvider: DatabaseProvider) {
    
  }

  ngOnInit() {
    this.initData()
  }

  goToWorkoutDetail(id: string) {
    this.router.navigate(['/workout-plan-detail', { id: id }]);
  }

  goToWorkoutRun(id: string) {
    this.router.navigate(['/workout-run', { id: id }])
  }

  async initData() {
    this.receiveAll().then(result => {
      this.workoutPlans = result
    })
  }

  async receiveAll(): Promise<WorkoutPlan[]> {
    return new Promise(resolve => {
      this.receiveWorkoutPlans().then(data => {
        this.updateWorkoutPlans(data).then(data => {
            this.workoutPlans = data
            this.workoutPlanRepositoryService.allWorkoutPlans = this.workoutPlans
        })
    
      })
    })
  }

  async updateWorkoutPlans(data: WorkoutPlan[]): Promise<WorkoutPlan[]> {
    let workoutPlans: WorkoutPlan[] = Array()
    for (let workoutPlan of data) {
      let newWorkoutPlan = new WorkoutPlan()
      Object.assign(newWorkoutPlan, workoutPlan)
      newWorkoutPlan.exerciseSets = Array()
      for (let exerciseSet of workoutPlan.exerciseSets) {
        const newExerciseSet = await this.databaseProvider.getExerciseSet(exerciseSet.id)
        const newExercise = await this.databaseProvider.getExercise(newExerciseSet.exercise.id)
        newExerciseSet.exercise = newExercise
        newWorkoutPlan.exerciseSets.push(newExerciseSet)
        // const newExercise = await this.databaseProvider.getExercise(exercise.id)
        // newWorkoutPlan.exercises.push(newExercise)
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
