import { WorkoutPlanExerciseSetItemComponent } from './../workout-plan-exercise-set-item/workout-plan-exercise-set-item.component';
import { WorkoutPlanListComponent } from '../workout-plan-list/workout-plan-list.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule
  ],
  declarations: [HomePage, WorkoutPlanListComponent, WorkoutPlanExerciseSetItemComponent]
})
export class HomePageModule {}
