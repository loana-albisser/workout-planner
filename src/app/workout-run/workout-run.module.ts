import { TranslateModule } from '@ngx-translate/core';
import { LottieModule } from 'ngx-lottie';
import { WorkoutRunItemComponent } from './workout-run-item/workout-run-item.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WorkoutRunPageRoutingModule } from './workout-run-routing.module';

import { WorkoutRunPage } from './workout-run.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WorkoutRunPageRoutingModule,
    LottieModule,
    TranslateModule
  ],
  declarations: [WorkoutRunPage, WorkoutRunItemComponent]
})
export class WorkoutRunPageModule {}
