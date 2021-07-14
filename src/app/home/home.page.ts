import { DatabaseProvider } from './../database-provider';
import { WorkoutPlanRepositoryService } from './../workout-plan-repository.service';
import { Component, NgZone } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SQLiteService } from '../sqlite.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  constructor() {
    }
}