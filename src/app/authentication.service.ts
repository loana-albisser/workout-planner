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

  initializeUser(): Promise<string> {
    return new Promise(resolve => {
      firebase.auth().onAuthStateChanged((user) => {
        resolve(user.uid);
      });
    });
  }

  login(email: string, password: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      firebase.auth().signInWithEmailAndPassword(email, password).then((userCredential) => {
        this.currentUser = userCredential.user.uid;
        resolve(true);
    })
    .catch((error) => {
      reject(error);
    });
    });
  }

  register(email: string, password: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      firebase.auth().createUserWithEmailAndPassword(email, password)
  .then((userCredential) => {
    this.currentUser = userCredential.user.uid;
        resolve(true);
  })
  .catch((error) => {
    reject(error);
  });
    });
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
