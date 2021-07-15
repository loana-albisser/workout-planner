import { ExerciseItemAddItemComponent } from './../exercise-item-add-item/exercise-item-add-item.component';
import { ExerciseItemAddComponent } from './../exercise-item-add/exercise-item-add.component';
import { NgModule, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WorkoutPlanAddPageRoutingModule } from './workout-plan-add-routing.module';

import { WorkoutPlanAddPage } from './workout-plan-add.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WorkoutPlanAddPageRoutingModule
  ],
  declarations: [WorkoutPlanAddPage, ExerciseItemAddComponent, ExerciseItemAddItemComponent]
})
export class WorkoutPlanAddPageModule {}
