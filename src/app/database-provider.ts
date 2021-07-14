import { Title } from '@angular/platform-browser';
import { WorkoutPlan, Exercise, SingleExerciseSet, ExerciseSet } from './model/workout-plan';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';

// We MUST import both the firebase AND firestore modules like so
import firebase from 'firebase/app'
import 'firebase/firestore'

@Injectable()
export class DatabaseProvider {
   private _DB : any;

   constructor(public http: HttpClient) 
   {
      this._DB = firebase.firestore();
   }
   createAndPopulateDocument(collectionObj : string,
                             docID         : string,
                             dataObj       : any) : Promise<any>
   {
      return new Promise((resolve, reject) =>
      {
         this._DB
         .collection(collectionObj)
         .doc(docID)
         .set(dataObj, { merge: true }) 
         .then((data : any) =>
         {
            resolve(data);
         })
         .catch((error : any) =>
         {
            reject(error);
         });
      });
   }

   async getWorkoutPlans(collectionObj : string) : Promise<WorkoutPlan[]>
   {
      return new Promise((resolve, reject) =>
      {
         this._DB.collection(collectionObj)
         .get()
         .then((querySnapshot) => 
         {
            let obj : any = [];
            querySnapshot.forEach((doc : any) => 
            {
               let id = doc.id
               let title = doc.data().title
               let exercises = Array()
               if (doc.data().exerciseSets !== undefined) {
                  doc.data().exerciseSets.forEach((id: string) => {
                        let exerciseSet = new ExerciseSet(id, new Exercise("", ""), [])
                        exercises.push(exerciseSet)
               })
               }
               let workoutPlan = new WorkoutPlan(id, title, exercises)
               obj.push(workoutPlan);
      
            });
            resolve(obj);
         })
         .catch((error : any) =>
         {
            reject(error);
         });
      });
   }

   getExerciseSet(id: string): Promise<ExerciseSet> 
   {
      return new Promise((resolve, reject) => 
      {
         var docRef = this._DB.collection("ExerciseSet").doc(id);

         docRef.get().then((doc) => {
            if (doc.exists) {
               let id = doc.id
               let exercise = new Exercise(doc.data().exercise, "")
               let exerciseSets: Array<SingleExerciseSet> = Array()
               for (let item of doc.data().sets) {
                  let set = new SingleExerciseSet(item.reps, item.weight)
                  exerciseSets.push(set)
               }
               let exerciseSet = new ExerciseSet(id, exercise, exerciseSets)
               resolve(exerciseSet)
            } else {
               reject()
            }
        }).catch((error) => {
            reject(error)
        });
      })
   }

   getExercise(id: string): Promise<Exercise> 
   {
      return new Promise((resolve, reject) => 
      {
         var docRef = this._DB.collection("Exercise").doc(id);

         docRef.get().then((doc) => {
            if (doc.exists) {
               let id = doc.id
               let title = doc.data().title
               let exercise = new Exercise(id, title)
               resolve(exercise)
            } else {
               reject()
            }
        }).catch((error) => {
            reject(error)
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
         this._DB.collection(collectionObj).add(dataObj)
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
         this._DB
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
         this._DB
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