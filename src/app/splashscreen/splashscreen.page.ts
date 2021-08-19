import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../authentication.service';
import { SplashScreen } from '@capacitor/splash-screen';
import { AnimationController } from '@ionic/angular';

@Component({
  selector: 'app-splashscreen',
  templateUrl: './splashscreen.page.html',
  styleUrls: ['./splashscreen.page.scss'],
})
export class SplashscreenPage implements OnInit {
  @ViewChild('icon ', { static: false }) icon;


  constructor(
    private animationCtrl: AnimationController,
    private authenticationService: AuthenticationService,
    private router: Router
  ) {
    SplashScreen.show({
      autoHide: false,
    });
  }

  ngOnInit() {
    SplashScreen.hide();
  }

  ionViewWillEnter(){
    const rowElement = this.icon.el;
    const animation = this.animationCtrl.create()
      .addElement(rowElement)
      .duration(1000)
      .iterations(1)
      .keyframes([
        { offset: 0, transform: 'scale(0.9)' },
        { offset: 0.5,  transform: 'scale(1.2)' },
        { offset: 1, transform: 'scale(0.9)' }
      ]);
      animation.play().then(() => {
        this.authenticationService.initializeUser().then((user) => {
          if (user != null) {
            this.authenticationService.currentUser = user;
            this.router.navigate(['/home', { uid: user, replaceUrl: true }]);
          } else {
            this.router.navigate(['/login'], { replaceUrl: true });
          }
        });
      });
  }
}
