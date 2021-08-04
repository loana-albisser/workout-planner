import { Router } from '@angular/router';
import { AuthenticationService } from './../authentication.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  email: string;
  password: string;
  isSubmitted = false;

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    public formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.initializeForm();

  }

  login() {
    this.isSubmitted = true;
    if (!this.loginForm.valid) {
      console.log('Please provide all the required values!');
      this.loginForm.controls.password.setErrors({invalid: true});
    } else {
      this.authenticationService.login(this.email, this.password).then(() => {
        this.router.navigate([
          '/home',
          { uid: this.authenticationService.currentUser.uid },
        ]);

      }).catch(() => {
        this.loginForm.controls.password.setErrors({invalid: true});
      });
    }
  }

  register() {
      this.router.navigateByUrl('/registration');
  }

  get errorControl() {
    return this.loginForm.controls;
  }

  private initializeForm() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.email]],
      password: ['', []]
   }, { updateOn: 'submit' });
  }
}
