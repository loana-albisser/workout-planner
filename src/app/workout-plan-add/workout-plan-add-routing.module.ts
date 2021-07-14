import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WorkoutPlanAddPage } from './workout-plan-add.page';

const routes: Routes = [
  {
    path: '',
    component: WorkoutPlanAddPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WorkoutPlanAddPageRoutingModule {}
