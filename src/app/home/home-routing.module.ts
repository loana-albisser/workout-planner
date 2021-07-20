import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
    children: [
      {
        path: 'workout',
        loadChildren: () =>
          import('../workout-overview/workout-overview.module').then(
            (m) => m.WorkoutOverviewPageModule
          ),
      },
      {
        path: 'progress',
        loadChildren: () =>
          import('../progress/progress.module').then(
            (m) => m.ProgressPageModule
          ),
      },
      {
        path: '',
        redirectTo: '/home/workout',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule {}
