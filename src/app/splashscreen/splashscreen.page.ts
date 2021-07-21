import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../authentication.service';
import { SplashScreen } from '@capacitor/splash-screen';

@Component({
  selector: 'app-splashscreen',
  templateUrl: './splashscreen.page.html',
  styleUrls: ['./splashscreen.page.scss'],
})
export class SplashscreenPage implements OnInit {

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router) {
      SplashScreen.show({
        autoHide: false
      });
    }

  ngOnInit() {
    this.authenticationService.initializeUser().then(user => {
      if (user != null) {
        this.authenticationService.currentUser = user;
        this.router.navigate([
          '/home',
          { uid: user },
        ]);
      } else {
        this.router.navigate([
          '/login'
        ]);
      }
      SplashScreen.hide();
    });
  }

}
