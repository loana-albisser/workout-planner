import { Router } from '@angular/router';
import { AuthenticationService } from './../authentication.service';
import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit() {
    if (this.authenticationService.getCurrentUser() != null) {
      this.router.navigate([
        '/home',
        { uid: this.authenticationService.currentUser.uid },
      ]);
    }
  }

  loginWithGoogle() {
    this.authenticationService.loginWithGoogle();
  }
}
