import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import firebase from 'firebase/app';
import 'firebase/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  currentUser: any;
  provider: any;

  constructor(private router: Router) {
    this.provider = new firebase.auth.GoogleAuthProvider();
  }

  getCurrentUser(): any {
    return firebase.auth().currentUser;
  }

  loginWithGoogle() {
    firebase
      .auth()
      .signInWithPopup(this.provider)
      .then((result) => {
        const user = result.user;
        console.log(firebase.auth().currentUser);
        this.router.navigate(['/home', { uid: result.user.uid }]);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.email;
        const credential = error.credential;
      });
  }
}
