import { ToastController } from '@ionic/angular';
import { ExerciseSet } from './../../model/workout-plan';
import { TranslateService } from '@ngx-translate/core';
import { Title } from '@angular/platform-browser';
import { Exercise, WorkoutPlan } from '../../model/workout-plan';
import { DatabaseProvider } from '../../database-provider';
import { WorkoutPlanRepositoryService } from '../../workout-plan-repository.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../../authentication.service';
import { threadId } from 'worker_threads';
import { delay } from 'rxjs-compat/operator/delay';
import { title } from 'process';

@Component({
  selector: 'app-workout-plan-list',
  templateUrl: './workout-plan-list.component.html',
  styleUrls: ['./workout-plan-list.component.scss'],
})
export class WorkoutPlanListComponent implements OnInit {
  workoutPlans: Array<WorkoutPlan> = Array();
  archivedWorkoutPlans: Array<WorkoutPlan> = Array();
  loaded = false;
  noPlansAdded = false;

  constructor(
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private authenticationService: AuthenticationService,
    public workoutPlanRepositoryService: WorkoutPlanRepositoryService,
    public databaseProvider: DatabaseProvider
  ) {}

  changeExpandItem(item: WorkoutPlan, event: any) {
    event.preventDefault();
    event.stopPropagation();
    const workoutPlan = this.archivedWorkoutPlans.find((w) => w.id === item.id);
    const currentExpanded = workoutPlan.expanded;
    workoutPlan.expanded = !currentExpanded;
  }

  async ngOnInit() {
    this.databaseProvider.onWorkoutPlansChanged.subscribe((workoutPlans) => {
      this.databaseProvider.getExerciseSets().then((exerciseSets) => {
        this.load(workoutPlans, exerciseSets).then((data) => {
          this.archivedWorkoutPlans = Array();
          this.workoutPlans = Array();
          for (let i = 0, len = data.length; i < len; i++) {
            if (data[i].archived) {
              this.archivedWorkoutPlans.push(data[i]);
            } else {
              this.workoutPlans.push(data[i]);
            }
          }
          this.workoutPlanRepositoryService.allWorkoutPlans = data;
          if (this.loaded) {
            if (this.workoutPlanRepositoryService.allWorkoutPlans.length > 0) {
              this.noPlansAdded = false;
            } else {
              this.noPlansAdded = true;
            }
          }
        });
      });
    });
    const uid = this.activatedRoute.snapshot.paramMap.get('uid');
    this.authenticationService.currentUser = uid;
    this.loadInitialList();
  }

  async load(
    workoutPlans: WorkoutPlan[],
    exerciseSets: ExerciseSet[]
  ): Promise<WorkoutPlan[]> {
    const exercises: Exercise[] = Array();
    for (
      let workoutPlanIndex = 0, length = workoutPlans.length;
      workoutPlanIndex < length;
      workoutPlanIndex++
    ) {
      const currentExerciseSets = Array<ExerciseSet>();
      Object.assign(
        currentExerciseSets,
        workoutPlans[workoutPlanIndex].exerciseSets
      );
      workoutPlans[workoutPlanIndex].exerciseSets = Array();
      for (let i = 0, len = currentExerciseSets.length; i < len; i++) {
        const newExerciseSet = exerciseSets.find(
          (item) => item.id === currentExerciseSets[i]?.id
        );
        if (newExerciseSet !== undefined) {
          const savedExercise = exercises.find(
            (item) => item.id === newExerciseSet.exercise.id
          );
          if (savedExercise !== undefined) {
            newExerciseSet.exercise = savedExercise;
          } else {
            const newExercise = await this.databaseProvider.getExercise(
              newExerciseSet.exercise.id
            );
            if (newExercise !== undefined) {
              exercises.push(newExercise);
              newExerciseSet.exercise = newExercise;
            }
          }
          workoutPlans[workoutPlanIndex].exerciseSets.push(newExerciseSet);
        }
      }
    }
    return workoutPlans;
  }

  loadInitialList() {
    return Promise.all([
      this.databaseProvider.getWorkoutPlans(),
      this.databaseProvider.getExerciseSets(),
    ]).then(async (value) => {
      const workoutPlans: WorkoutPlan[] = value[0];
      const exerciseSets: ExerciseSet[] = value[1];
      this.load(workoutPlans, exerciseSets).then((result) => {
        this.archivedWorkoutPlans = Array();
        this.workoutPlans = Array();
        for (let i = 0, len = result.length; i < len; i++) {
          if (result[i].archived) {
            this.archivedWorkoutPlans.push(result[i]);
          } else {
            this.workoutPlans.push(result[i]);
          }
        }
        this.workoutPlanRepositoryService.allWorkoutPlans = result;
        if (this.databaseProvider.workoutPlanLoaded) {
          if (this.workoutPlanRepositoryService.allWorkoutPlans.length === 0) {
            this.noPlansAdded = true;
          }
          this.loaded = true;
        }
      });
    });
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
    const exercises: Exercise[] = Array();
    for (
      let workoutPlanIndex = 0, length = data.length;
      workoutPlanIndex < length;
      workoutPlanIndex++
    ) {
      const newWorkoutPlan = new WorkoutPlan();
      Object.assign(newWorkoutPlan, data[workoutPlanIndex]);
      newWorkoutPlan.exerciseSets = Array();
      for (
        let i = 0, len = data[workoutPlanIndex].exerciseSets.length;
        i < len;
        i++
      ) {
        const newExerciseSet = await this.databaseProvider.getExerciseSet(
          data[workoutPlanIndex].exerciseSets[i].id
        );
        const savedExercise = exercises.find(
          (item) =>
            item.id === data[workoutPlanIndex].exerciseSets[i].exercise.id
        );
        if (savedExercise !== undefined) {
          newExerciseSet.exercise = savedExercise;
        } else {
          const newExercise = await this.databaseProvider.getExercise(
            newExerciseSet.exercise.id
          );
          exercises.push(newExercise);
          newExerciseSet.exercise = newExercise;
        }
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
