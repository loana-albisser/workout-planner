import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { ExerciseItemAddItemComponent } from '../exercise-item-add/exercise-item-add-item/exercise-item-add-item.component';
import { ExerciseItemAddComponent } from '../exercise-item-add/exercise-item-add.component';
import { NgModule, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WorkoutPlanAddPageRoutingModule } from './workout-plan-add-routing.module';

import { WorkoutPlanAddPage } from './workout-plan-add.page';
import { HttpLoaderFactory } from 'src/app/app.module';
import { HttpClient } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WorkoutPlanAddPageRoutingModule,
    TranslateModule
  ],
  declarations: [WorkoutPlanAddPage, ExerciseItemAddComponent, ExerciseItemAddItemComponent]
})
export class WorkoutPlanAddPageModule {}
