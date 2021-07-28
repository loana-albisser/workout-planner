import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateCustomExercisePage } from './create-custom-exercise.page';

const routes: Routes = [
  {
    path: '',
    component: CreateCustomExercisePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateCustomExercisePageRoutingModule {}
