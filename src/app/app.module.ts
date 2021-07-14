import { WorkoutPlanRepositoryService } from './workout-plan-repository.service';
import { SQLiteService } from './sqlite.service';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { DatabaseProvider } from './database-provider';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, HttpClientModule,    IonicModule.forRoot(), AppRoutingModule],
  providers: [ SQLiteService, DatabaseProvider, WorkoutPlanRepositoryService, { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
