import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExerciseSetEditItemComponent } from '../workout-plan-detail/exercise-set-edit-item/exercise-set-edit-item.component';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [ ExerciseSetEditItemComponent ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
],
  exports: [ ExerciseSetEditItemComponent ]


})
export class SharedModule { }
