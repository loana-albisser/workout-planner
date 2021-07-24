import { SharedModule } from './../shared/shared.module';
import { ExerciseSetEditItemComponent } from './exercise-set-edit-item/exercise-set-edit-item.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WorkoutPlanDetailPageRoutingModule } from './workout-plan-detail-routing.module';

import { WorkoutPlanDetailPage } from './workout-plan-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    WorkoutPlanDetailPageRoutingModule,
  ],
  declarations: [WorkoutPlanDetailPage],
})
export class WorkoutPlanDetailPageModule {}
