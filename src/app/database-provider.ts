import { AuthenticationService } from './authentication.service';
import { Title } from '@angular/platform-browser';
import { WorkoutPlan, Exercise, SingleExerciseSet, ExerciseSet } from './model/workout-plan';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';

import firebase from 'firebase/app';
import 'firebase/firestore';

@Injectable()
export class DatabaseProvider {
   private firestore: any;

   constructor(public http: HttpClient,
    public authenticationService: AuthenticationService)
   {
      this.firestore = firebase.firestore();
   }
   createAndPopulateDocument(collectionObj: string,
                             docID: string,
                             dataObj: any): Promise<any>
   {
      return new Promise((resolve, reject) =>
      {
         this.firestore.collection(collectionObj).doc(docID)
         .set(dataObj, { merge: true })
         .then((data: any) =>
         {
            resolve(data);
         })
         .catch((error : any) =>
         {
            reject(error);
         });
      });
   }

   async getWorkoutPlans(): Promise<WorkoutPlan[]>
   {
      return new Promise((resolve, reject) =>
      {
        debugger;
        const uid = this.authenticationService.currentUser;
         this.firestore.collection('WorkoutPlan').where('user', '==', uid)
         .get().then((querySnapshot) =>
         {
            const obj: any = [];
            querySnapshot.forEach((doc: any) =>
            {
               const id = doc.id;
               const title = doc.data().title;
               const exercises = Array();
               if (doc.data().exerciseSets !== undefined) {
                  doc.data().exerciseSets.forEach((setId: string) => {
                        const exerciseSet = new ExerciseSet(setId, new Exercise('', ''), []);
                        exercises.push(exerciseSet);
               });
               }
               const workoutPlan = new WorkoutPlan(id, title, this.authenticationService.currentUser.uid, exercises);
               obj.push(workoutPlan);

            });
            resolve(obj);
         })
         .catch((error: any) =>
         {
            reject(error);
         });
      });
   }

   getAllExercises(): Promise<Exercise[]>{
    return new Promise((resolve, reject) =>
    {
       const docRef = this.firestore.collection('Exercise');
       const obj: any = [];

        docRef.get().then((doc) => {
        doc.forEach((result: any) =>
        {
           const id = result.id;
           const title = result.data().title;
           const exercise = new Exercise(id, title);

           obj.push(exercise);

        });
        resolve(obj);
      }).catch((error: any) => {
          reject(error);
      });
    });
  }

   getExerciseSet(id: string): Promise<ExerciseSet>
   {
      return new Promise((resolve, reject) =>
      {
         const docRef = this.firestore.collection('ExerciseSet').doc(id);

         docRef.get().then((doc) => {
            if (doc.exists) {
              const setId = doc.id;
              const exercise = new Exercise(doc.data().exercise, '')
;              const exerciseSets: Array<SingleExerciseSet> = Array();
               for (const item of doc.data().sets) {
                const set = new SingleExerciseSet(item.reps, item.weight);
                  exerciseSets.push(set);
               }
               const exerciseSet = new ExerciseSet(setId, exercise, exerciseSets);
               resolve(exerciseSet);
            } else {
               reject();
            }
        }).catch((error: any) => {
            reject(error);
        });
      });
   }

   getExercise(id: string): Promise<Exercise>
   {
      return new Promise((resolve, reject) =>
      {
         const docRef = this.firestore.collection('Exercise').doc(id);

         docRef.get().then((doc) => {
            if (doc.exists) {
               const id = doc.id;
               const title = doc.data().title;
               const exercise = new Exercise(id, title);
               resolve(exercise);
            } else {
               reject();
            }
        }).catch((error: any) => {
            reject(error);
        });
      })
   }



   /**
    * Add a new document to a selected database collection
    *
    * @public
    * @method addDocument
    * @param  collectionObj    {String}           The database collection we want to add a new document to
    * @param  docObj           {Any}              The key/value object we want to add
    * @return {Promise}
    */
   addDocument(collectionObj : string,
             dataObj       : any) : Promise<any>
   {
      return new Promise((resolve, reject) =>
      {
         this.firestore.collection(collectionObj).add(dataObj)
         .then((obj: any) =>
         {
            resolve(obj);
         })
         .catch((error : any) =>
         {
            reject(error);
         });
      });
   }



   /**
    * Delete an existing document from a selected database collection
    *
    * @public
    * @method deleteDocument
    * @param  collectionObj    {String}           The database collection we want to delete a document from
    * @param  docObj           {Any}              The document we wish to delete
    * @return {Promise}
    */
   deleteDocument(collectionObj : string,
                docID         : string) : Promise<any>
   {
      return new Promise((resolve, reject) =>
      {
         this.firestore
         .collection(collectionObj)
         .doc(docID)
         .delete()
         .then((obj : any) =>
         {
            resolve(obj);
         })
         .catch((error : any) =>
         {
            reject(error);
         });
      });
   }



   /**
    * Update an existing document within a selected database collection
    *
    * @public
    * @method updateDocument
    * @param  collectionObj    {String}           The database collection to be used
    * @param  docID            {String}           The document ID
    * @param  dataObj          {Any}              The document key/values to be updated
    * @return {Promise}
    */
   updateDocument(collectionObj : string,
                docID         : string,
                dataObj       : any) : Promise<any>
   {
      return new Promise((resolve, reject) =>
      {
         this.firestore
         .collection(collectionObj)
         .doc(docID)
         .update(dataObj)
         .then((obj : any) =>
         {
            resolve(obj);
         })
         .catch((error : any) =>
         {
            reject(error);
         });
      });
   }

}
