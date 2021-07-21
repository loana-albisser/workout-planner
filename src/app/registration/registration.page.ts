import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss'],
})
export class RegistrationPage implements OnInit {
  registrationForm: FormGroup;
  email: string;
  password: string;
  isSubmitted = false;

  constructor(private location: Location,
    private router: Router,
    private authenticationService: AuthenticationService,
    public formBuilder: FormBuilder) { }

  ngOnInit() {
    this.initializeForm();
  }

register() {
  this.isSubmitted = true;
  this.authenticationService.register(this.email, this.password).then(user => {
    this.router.navigate([
      '/home',
      { uid: this.authenticationService.currentUser.uid },
    ]);
  }).catch(() => {
    this.registrationForm.controls.password.setErrors({invalid: true});
  });;
}

  goToLoginPage() {
      this.location.back();
  }

  get errorControl() {
    return this.registrationForm.controls;
  }

  private initializeForm() {
    this.registrationForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
   });
  }

}
