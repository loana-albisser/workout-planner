import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateCustomExercisePageRoutingModule } from './create-custom-exercise-routing.module';

import { CreateCustomExercisePage } from './create-custom-exercise.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    CreateCustomExercisePageRoutingModule,
  ],
  providers: [DecimalPipe],
  declarations: [CreateCustomExercisePage],
})
export class CreateCustomExercisePageModule {}
