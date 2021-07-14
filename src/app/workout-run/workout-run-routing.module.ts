import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WorkoutRunPage } from './workout-run.page';

const routes: Routes = [
  {
    path: '',
    component: WorkoutRunPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WorkoutRunPageRoutingModule {}
