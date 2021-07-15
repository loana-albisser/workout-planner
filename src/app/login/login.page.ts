import { AuthenticationService } from './../authentication.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {

  constructor(private authenticationService: AuthenticationService) { }

  loginWithGoogle() {
    this.authenticationService.loginWithGoogle();
  }

}
