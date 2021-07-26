import { TranslateService } from '@ngx-translate/core';
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
  archivedWorkoutPlans: Array<WorkoutPlan> = Array();

  constructor(
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private authenticationService: AuthenticationService,
    public workoutPlanRepositoryService: WorkoutPlanRepositoryService,
    private databaseProvider: DatabaseProvider
  ) {}

  ngOnInit() {
    this.databaseProvider.onWorkoutPlansChanged.subscribe(workoutPlans => {
      this.updateWorkoutPlans(workoutPlans).then((data) => {
        this.archivedWorkoutPlans = Array();
        this.workoutPlans = Array();
        data.forEach(plan => {
          if (plan.archived) {
              this.archivedWorkoutPlans.push(plan);
          } else {
              this.workoutPlans.push(plan);
          }
        });
        // this.workoutPlans = data;
        this.workoutPlanRepositoryService.allWorkoutPlans = data;
      });
    });
    const uid = this.activatedRoute.snapshot.paramMap.get('uid');
    this.authenticationService.currentUser = uid;
    this.receiveWorkoutPlans();
  }

  hasArchivedPlans(): boolean {
    return this.archivedWorkoutPlans.length > 0;
  }

  goToWorkoutDetail(id: string) {
    this.router.navigate(['/workout-plan-detail', { id }]);
  }

  goToWorkoutRun(id: string, event: any) {
    event.preventDefault();
    event.stopPropagation();
    this.router.navigate(['/workout-run', { id }]);
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
