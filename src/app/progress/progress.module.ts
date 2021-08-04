import { TranslateModule } from '@ngx-translate/core';
import { ProgressItemComponent } from './progress-item/progress-item.component';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProgressPageRoutingModule } from './progress-routing.module';

import { ProgressPage } from './progress.page';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProgressPageRoutingModule,
    Ng2GoogleChartsModule,
    TranslateModule
  ],
  declarations: [ProgressPage, ProgressItemComponent],
  providers: [DatePipe]
})
export class ProgressPageModule {}
