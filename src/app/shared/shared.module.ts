import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExerciseSetEditItemComponent } from '../workout-plan-detail/exercise-set-edit-item/exercise-set-edit-item.component';



@NgModule({
  declarations: [ ExerciseSetEditItemComponent ],
  imports: [
    CommonModule
  ],
  exports: [ ExerciseSetEditItemComponent ]


})
export class SharedModule { }
