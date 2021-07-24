import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WorkoutOverviewPageRoutingModule } from './workout-overview-routing.module';

import { WorkoutOverviewPage } from './workout-overview.page';
import { WorkoutPlanListComponent } from './workout-plan-list/workout-plan-list.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WorkoutOverviewPageRoutingModule,
  ],
  declarations: [WorkoutOverviewPage, WorkoutPlanListComponent],
})
export class WorkoutOverviewPageModule {}
