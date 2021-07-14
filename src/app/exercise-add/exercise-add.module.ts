import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExerciseAddPageRoutingModule } from './exercise-add-routing.module';

import { ExerciseAddPage } from './exercise-add.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExerciseAddPageRoutingModule
  ],
  declarations: [ExerciseAddPage]
})
export class ExerciseAddPageModule {}
