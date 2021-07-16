import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WorkoutOverviewPage } from './workout-overview.page';

const routes: Routes = [
  {
    path: '',
    component: WorkoutOverviewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WorkoutOverviewPageRoutingModule {}
