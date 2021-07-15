import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'workout-plan-add',
    loadChildren: () => import('./add-workout-plan/workout-plan-add/workout-plan-add.module').then( m => m.WorkoutPlanAddPageModule)
  },
  {
    path: 'exercise-add',
    loadChildren: () => import('./add-workout-plan/exercise-add/exercise-add.module').then( m => m.ExerciseAddPageModule)
  },
  {
    path: 'workout-plan-detail',
    loadChildren: () => import('./workout-plan-detail/workout-plan-detail.module').then( m => m.WorkoutPlanDetailPageModule)
  },
  {
    path: 'workout-run',
    loadChildren: () => import('./workout-run/workout-run.module').then( m => m.WorkoutRunPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
