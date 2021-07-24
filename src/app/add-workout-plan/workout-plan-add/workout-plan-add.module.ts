import { SharedModule } from './../../shared/shared.module';
import { AppModule } from './../../app.module';
import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
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
    WorkoutPlanAddPageRoutingModule,
    TranslateModule,
    SharedModule
  ],
  declarations: [WorkoutPlanAddPage]
})
export class WorkoutPlanAddPageModule {}
