import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import firebase from "firebase/app";
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private platform: Platform) {
    this.platform.ready().then(async () => {
      debugger;
    firebase.initializeApp(environment.firebaseConfig)
    });
  }
}
