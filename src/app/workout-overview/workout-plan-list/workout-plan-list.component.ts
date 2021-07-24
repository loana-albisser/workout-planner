import { Title } from '@angular/platform-browser';
import { Exercise, WorkoutPlan } from '../../model/workout-plan';
import { DatabaseProvider } from '../../database-provider';
import { WorkoutPlanRepositoryService } from '../../workout-plan-repository.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../../authentication.service';

@Component({
  selector: 'app-workout-plan-list',
  templateUrl: './workout-plan-list.component.html',
  styleUrls: ['./workout-plan-list.component.scss'],
})
export class WorkoutPlanListComponent implements OnInit {
  workoutPlans: Array<WorkoutPlan> = Array();

  constructor(
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private authenticationService: AuthenticationService,
    public workoutPlanRepositoryService: WorkoutPlanRepositoryService,
    private databaseProvider: DatabaseProvider
  ) {}

  ngOnInit() {
    const uid = this.activatedRoute.snapshot.paramMap.get('uid');
    this.authenticationService.currentUser = uid;
    this.initData();
  }

  goToWorkoutDetail(id: string) {
    this.router.navigate(['/workout-plan-detail', { id }]);
  }

  goToWorkoutRun(id: string, event: any) {
    event.preventDefault();
    event.stopPropagation();
    this.router.navigate(['/workout-run', { id }]);
  }

  async initData() {
    this.receiveAll().then((result) => {
      this.workoutPlans = result;
    });
  }

  async receiveAll(): Promise<WorkoutPlan[]> {
    return new Promise((resolve) => {
      this.receiveWorkoutPlans().then((data) => {
        this.updateWorkoutPlans(data).then((data) => {
          this.workoutPlans = data;
          this.workoutPlanRepositoryService.allWorkoutPlans = this.workoutPlans;
        });
      });
    });
  }

  async updateWorkoutPlans(data: WorkoutPlan[]): Promise<WorkoutPlan[]> {
    const workoutPlans: WorkoutPlan[] = Array();
    for (const workoutPlan of data) {
      const newWorkoutPlan = new WorkoutPlan();
      Object.assign(newWorkoutPlan, workoutPlan);
      newWorkoutPlan.exerciseSets = Array();
      for (const exerciseSet of workoutPlan.exerciseSets) {
        const newExerciseSet = await this.databaseProvider.getExerciseSet(
          exerciseSet.id
        );
        const newExercise = await this.databaseProvider.getExercise(
          newExerciseSet.exercise.id
        );
        newExerciseSet.exercise = newExercise;
        newWorkoutPlan.exerciseSets.push(newExerciseSet);
      }
      workoutPlans.push(newWorkoutPlan);
    }
    return workoutPlans;
  }

  async receiveWorkoutPlans(): Promise<WorkoutPlan[]> {
    return new Promise((resolve) => {
      this.databaseProvider.getWorkoutPlans().then((data) => {
        resolve(data);
      });
    });
  }

  async receiveExercise(id: string): Promise<Exercise> {
    return new Promise((resolve) => {
      this.databaseProvider.getExercise(id).then((data) => {
        resolve(data);
      });
    });
  }
}
