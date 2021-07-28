import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () =>
      import('./login/login.module').then((m) => m.LoginPageModule),
  },
  {
    path: 'home',
    loadChildren: () =>
      import('./home/home.module').then((m) => m.HomePageModule),
  },
  {
    path: '',
    redirectTo: 'splashscreen',
    pathMatch: 'full',
  },
  {
    path: 'workout-plan-add',
    loadChildren: () =>
      import(
        './add-workout-plan/workout-plan-add/workout-plan-add.module'
      ).then((m) => m.WorkoutPlanAddPageModule),
  },
  {
    path: 'exercise-add',
    loadChildren: () =>
      import('./add-workout-plan/exercise-add/exercise-add.module').then(
        (m) => m.ExerciseAddPageModule
      ),
  },
  {
    path: 'workout-plan-detail',
    loadChildren: () =>
      import('./workout-plan-detail/workout-plan-detail.module').then(
        (m) => m.WorkoutPlanDetailPageModule
      ),
  },
  {
    path: 'workout-run',
    loadChildren: () =>
      import('./workout-run/workout-run.module').then(
        (m) => m.WorkoutRunPageModule
      ),
  },
  {
    path: 'workout-overview',
    loadChildren: () =>
      import('./workout-overview/workout-overview.module').then(
        (m) => m.WorkoutOverviewPageModule
      ),
  },
  {
    path: 'progress',
    loadChildren: () =>
      import('./progress/progress.module').then((m) => m.ProgressPageModule),
  },
  {
    path: 'splashscreen',
    loadChildren: () => import('./splashscreen/splashscreen.module').then( m => m.SplashscreenPageModule)
  },
  {
    path: 'registration',
    loadChildren: () => import('./registration/registration.module').then( m => m.RegistrationPageModule)
  },
  {
    path: 'info',
    loadChildren: () => import('./info/info.module').then( m => m.InfoPageModule)
  },
  {
    path: 'create-custom-exercise',
    loadChildren: () => import('./add-workout-plan/exercise-add/create-custom-exercise/create-custom-exercise.module')
    .then(m => m.CreateCustomExercisePageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
