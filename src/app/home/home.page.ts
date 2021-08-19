import { DatabaseProvider } from './../database-provider';
import { WorkoutPlanRepositoryService } from './../workout-plan-repository.service';
import { Component, NgZone, OnInit } from '@angular/core';
import { IonRouterOutlet, Platform } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{

  constructor(private routerOutlet: IonRouterOutlet) {}

  ngOnInit(): void {
    this.routerOutlet.swipeGesture = false;
  }
}
