import { TranslateService } from '@ngx-translate/core';
/* eslint-disable @typescript-eslint/no-shadow */
import { WorkoutRun, ExecutedExercise } from './workout-run/workout-run.page';
import { AuthenticationService } from './authentication.service';
import { Title } from '@angular/platform-browser';
import {
  WorkoutPlan,
  Exercise,
  SingleExerciseSet,
  ExerciseSet,
} from './model/workout-plan';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';

import firebase from 'firebase/app';
import 'firebase/firestore';
import { title } from 'process';

@Injectable()
export class DatabaseProvider {
  private firestore: any;

  constructor(
    public http: HttpClient,
    public authenticationService: AuthenticationService,
    private translateService: TranslateService
  ) {
    this.firestore = firebase.firestore();
  }

  getWorkoutPlans(): Promise<WorkoutPlan[]> {
    return new Promise((resolve, reject) => {
      const uid = this.authenticationService.getCurrentUser().uid;
      this.firestore
        .collection('WorkoutPlan')
        .where('user', '==', uid)
        .onSnapshot((querySnapshot) => {
          const obj: any = [];
          querySnapshot.forEach((doc: any) => {
            const id = doc.id;
            const title = doc.data().title;
            const exercises = Array();
            if (doc.data().exerciseSets !== undefined) {
              doc.data().exerciseSets.forEach((setId: string) => {
                const exerciseSet = new ExerciseSet(
                  setId,
                  new Exercise('', ''),
                  []
                );
                exercises.push(exerciseSet);
              });
            }
            const workoutPlan = new WorkoutPlan(id, title, uid, exercises);
            obj.push(workoutPlan);
          });
          resolve(obj);
        });
    });
  }

  setExerciseSet(
    exerciseId: string,
    singleExerciseSet: SingleExerciseSet[]
  ): Promise<string> {
    // TODO add Converter
    return new Promise((resolve, reject) => {
      const exerciseSet = Array();
      singleExerciseSet.forEach((item) => {
        exerciseSet.push({
          reps: Number(item.reps),
          weight: Number(item.weight),
        });
      });
      const castedExerciseSetList = exerciseSet.map((obj) =>
        Object.assign({}, obj)
      );
      this.firestore
        .collection('ExerciseSet')
        .add({ exercise: exerciseId, sets: castedExerciseSetList })
        .then((data) => {
          resolve(data.id);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  updateExerciseSet(
    exerciseSetId: string,
    singleExerciseSet: SingleExerciseSet[]
  ) {
    const exerciseSet = Array();
    singleExerciseSet.forEach((item) => {
      exerciseSet.push({
        reps: Number(item.reps),
        weight: Number(item.weight),
      });
    });
    this.firestore
      .collection('ExerciseSet')
      .doc(exerciseSetId)
      .update({ sets: exerciseSet })
      .then(() => {
        console.log('Document successfully updated!');
      })
      .catch((error) => {
        console.error('Error updating document: ', error);
      });
  }

  addExerciseSet(exerciseSet: ExerciseSet): Promise<string> {
    return new Promise((resolve, reject) => {
      const newExerciseSet = Array();
      debugger;
      exerciseSet.exerciseSets.forEach((item) => {
        newExerciseSet.push({
          reps: Number(item.reps),
          weight: Number(item.weight),
        });
      });
      this.firestore
        .collection('ExerciseSet')
        .add({
          exercise: exerciseSet.exercise.id,
          sets: newExerciseSet,
        })
        .then((data) => {
          resolve(data.id);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  removeExerciseSet(exerciseSet: ExerciseSet): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.firestore
        .collection('ExerciseSet')
        .doc(exerciseSet.id)
        .delete()
        .then((data) => {
          resolve(true);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  removeExerciseSetFromWorkoutPlan(planId: string, setId: string) {
    const workoutPlanCollection = this.firestore
      .collection('WorkoutPlan')
      .doc(planId);

    workoutPlanCollection.update({
      exerciseSets: firebase.firestore.FieldValue.arrayRemove(setId),
    });
  }

  addWorkoutPlan(workoutPlan: WorkoutPlan): Promise<string> {
    return new Promise((resolve, reject) => {
      const workoutPlanCollection = this.firestore.collection('WorkoutPlan');
      const castedSetIdList = Array();
      workoutPlan.exerciseSets.forEach((item) => {
        castedSetIdList.push(item.id);
      });
      const user = this.authenticationService.getCurrentUser().uid;

      workoutPlanCollection
        .add({
          title: workoutPlan.title,
          user,
        })
        .then((data) => {
          resolve(data.id);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  addExerciseSetToWorkoutPlan(planId: string, setId: string): Promise<boolean> {
    return new Promise((resolve) => {
      const workoutPlanCollection = this.firestore
        .collection('WorkoutPlan')
        .doc(planId);

      workoutPlanCollection
        .update({
          exerciseSets: firebase.firestore.FieldValue.arrayUnion(setId),
        })
        .then(() => {
          resolve(true);
        });
    });
  }

  updateWorkoutPlanTitle(planId: string, newTitle: string) {
    const workoutPlanCollection = this.firestore
      .collection('WorkoutPlan')
      .doc(planId);

    workoutPlanCollection.update({
      title: newTitle,
    });
  }

  addExerciseSetsToWorkoutPlan(planId: string, setIds: Array<string>) {
    return new Promise((resolve) => {
      const workoutPlanCollection = this.firestore
        .collection('WorkoutPlan')
        .doc(planId);

      workoutPlanCollection
        .update({
          exerciseSets: setIds,
        })
        .then(() => {
          resolve(true);
        });
    });
  }

  addWorkoutRun(workoutRun: WorkoutRun) {
    const workoutRunCollection = this.firestore.collection('WorkoutRun');
    const uid = this.authenticationService.getCurrentUser().uid;
    workoutRunCollection
      .add({
        date: firebase.firestore.FieldValue.serverTimestamp(),
        user: uid,
        executedPlan: workoutRun.executedPlan,
      })
      .then((data) => {
        workoutRun.executedExercises.forEach((item) => {
          if (item.set.length > 0) {
            const minimizedSetList = Array();
            item.set.forEach((set) => {
              minimizedSetList.push({
                reps: Number(set.reps),
                weight: Number(set.weight),
              });
            });
            const castedSetList = minimizedSetList.map((obj) =>
              Object.assign({}, obj)
            );
            workoutRunCollection
              .doc(data.id)
              .update({
                executedExercises: firebase.firestore.FieldValue.arrayUnion({
                  exercise: item.exercise,
                  set: castedSetList,
                }),
              })
              .then((result) => {})
              .catch((err) => {});
          }
        });
      })
      .catch((error) => {
        const test = error;
      });
  }

  receiveAllWorkoutRuns(): Promise<WorkoutRun[]> {
    return new Promise((resolve, reject) => {
      const docRef = this.firestore.collection('WorkoutRun');
      const obj: any = [];
      const uid = this.authenticationService.getCurrentUser().uid;

      docRef.where('user', '==', uid).onSnapshot((doc) => {
        doc.forEach((result: any) => {
          const workoutRun = result.data();
          obj.push(workoutRun);
        });
        resolve(obj);
      });
    });
  }

  receiveMuscleGroups(): Promise<MuscleGroup[]> {
    return new Promise((resolve, reject) => {
      const docRef = this.firestore.collection('MuscleGroups');
      const obj: any = [];
      const uid = this.authenticationService.getCurrentUser().uid;

      docRef.get().then((doc) => {
        doc.forEach((result: any) => {
          const title = result.data().title;
          this.translateService.get(title).subscribe(result => {
            const muscleGroup = new MuscleGroup(title, result);
            obj.push(muscleGroup);
          });
        });
        resolve(obj);
      });
    });
  }

  getAllExercises(): Promise<Exercise[]> {
    return new Promise((resolve, reject) => {
      const docRef = this.firestore.collection('Exercise');
      const obj: any = [];

      docRef
        .get()
        .then((doc) => {
          doc.forEach((result: any) => {
            const id = result.id;
            const title = result.data().title;
            const muscleGroups = result.data().muscleGroups;
            const exercise = new Exercise(id, title);
            exercise.muscleGroups = muscleGroups;

            obj.push(exercise);
          });
          resolve(obj);
        })
        .catch((error: any) => {
          reject(error);
        });
    });
  }

  getExerciseSet(id: string): Promise<ExerciseSet> {
    return new Promise((resolve, reject) => {
      const docRef = this.firestore.collection('ExerciseSet').doc(id);

      docRef
        .get()
        .then((doc) => {
          if (doc.exists) {
            const setId = doc.id;
            const exercise = new Exercise(doc.data().exercise, '');
            const exerciseSets: Array<SingleExerciseSet> = Array();
            for (const item of doc.data().sets) {
              const set = new SingleExerciseSet(item.reps, item.weight);
              exerciseSets.push(set);
            }
            const exerciseSet = new ExerciseSet(setId, exercise, exerciseSets);
            resolve(exerciseSet);
          } else {
            reject();
          }
        })
        .catch((error: any) => {
          reject(error);
        });
    });
  }

  getExercise(id: string): Promise<Exercise> {
    return new Promise((resolve, reject) => {
      const docRef = this.firestore.collection('Exercise').doc(id);

      docRef
        .get()
        .then((doc) => {
          if (doc.exists) {
            const id = doc.id;
            const title = doc.data().title;
            const exercise = new Exercise(id, title);
            resolve(exercise);
          } else {
            reject();
          }
        })
        .catch((error: any) => {
          reject(error);
        });
    });
  }
}

export class MuscleGroup {
  constructor(public id: string, public title: string) {}
}
