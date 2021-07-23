import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import firebase from 'firebase/app';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private platform: Platform,
    private translate: TranslateService) {
    this.platform.ready().then(async () => {
      firebase.initializeApp(environment.firebaseConfig);
      this.translate.setDefaultLang('en');
    });
  }
}
