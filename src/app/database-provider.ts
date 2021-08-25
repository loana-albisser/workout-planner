import { WorkoutPlanRepositoryService } from './workout-plan-repository.service';
import { TranslateService } from '@ngx-translate/core';
import { WorkoutRun, ExecutedExercise } from './workout-run/workout-run.page';
import { AuthenticationService } from './authentication.service';
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
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class DatabaseProvider {
  onWorkoutPlansChanged: BehaviorSubject<any> = new BehaviorSubject([]);
  onWorkoutRunsChanged: BehaviorSubject<any> = new BehaviorSubject([]);
  onExercisesChanged: BehaviorSubject<any> = new BehaviorSubject([]);

  workoutPlanLoaded = false;

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
            const archived = doc.data().archived;
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
            const workoutPlan = new WorkoutPlan(
              id,
              title,
              uid,
              archived,
              exercises
            );
            obj.push(workoutPlan);
          });
        this.workoutPlanLoaded = true;
          this.onWorkoutPlansChanged.next(obj);
          resolve(obj);
        });
    });
  }

  getExerciseSets(): Promise<ExerciseSet[]> {
    return new Promise((resolve, reject) => {
      const uid = this.authenticationService.getCurrentUser().uid;
      this.firestore
        .collection('ExerciseSet')
        .where('user', '==', uid)
        .onSnapshot((querySnapshot) => {
          const obj: any = [];
          querySnapshot.forEach((doc: any) => {
            const setId = doc.id;
            const exercise = new Exercise(doc.data().exercise, '');
            const exerciseSets: Array<SingleExerciseSet> = Array();
            // doc.data().sets
            const sets = doc.data().sets;
            for (let i = 0, len = sets.length; i < len; i++) {
              let set;
              if (sets[i].time !== undefined && sets[i].time !== null) {
                set = new SingleExerciseSet();
                set.time = sets[i].time;
              } else {
                set = new SingleExerciseSet(sets[i].reps, sets[i].weight);
              }
              exerciseSets.push(set);
            }
            const exerciseSet = new ExerciseSet(setId, exercise, exerciseSets);
            obj.push(exerciseSet);
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
        if (item.time !== undefined && item.time !== null) {
          exerciseSet.push({
            time: Number(item.time),
          });
        } else {
          exerciseSet.push({
            reps: Number(item.reps),
            weight: Number(item.weight),
          });
        }
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
      if (item.time !== undefined && item.time !== null) {
        exerciseSet.push({
          time: Number(item.time),
        });
      } else {
        exerciseSet.push({
          reps: Number(item.reps),
          weight: Number(item.weight),
        });
      }
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
    const uid = this.authenticationService.getCurrentUser().uid;
    return new Promise((resolve, reject) => {
      const newExerciseSet = Array();
      exerciseSet.exerciseSets.forEach((item) => {
        if (item.time !== undefined && item.time !== null) {
          newExerciseSet.push({
            time: Number(item.time),
          });
        } else {
          newExerciseSet.push({
            reps: Number(item.reps),
            weight: Number(item.weight),
          });
        }
      });
      this.firestore
        .collection('ExerciseSet')
        .add({
          exercise: exerciseSet.exercise.id,
          sets: newExerciseSet,
          user: uid
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

  removeWorkoutPlan(workoutPlanId: string) {
    this.firestore.collection('WorkoutPlan').doc(workoutPlanId).delete();
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

  updateWorkoutPlanArchive(planId: string, isArchived: boolean) {
    const workoutPlanCollection = this.firestore
      .collection('WorkoutPlan')
      .doc(planId);

    workoutPlanCollection.update({
      archived: isArchived,
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
              if (set.time !== undefined && set.time !== null) {
                minimizedSetList.push({
                  time: Number(set.time),
                });
              } else {
                minimizedSetList.push({
                  reps: Number(set.reps),
                  weight: Number(set.weight),
                });
              }
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

      docRef
        .where('user', '==', uid)
        .orderBy('date', 'desc')
        .onSnapshot((doc) => {
          doc.forEach((result: any) => {
            const workoutRun = result.data();
            obj.push(workoutRun);
          });
          this.onWorkoutRunsChanged.next(obj);
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
          this.translateService.get(title).subscribe((result) => {
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
      const uid = this.authenticationService.getCurrentUser().uid;
      docRef.orderBy('title').onSnapshot((querySnapshot) => {
        const obj: any = [];
        querySnapshot.forEach((doc: any) => {
          const user = doc.data().user;
          if (user === uid || user === 'all') {
            const id = doc.id;
            const title = doc.data().title;
            const muscleGroups = doc.data().muscleGroups;
            const exercise = new Exercise(id, title);
            const unit = doc.data().unit;
            exercise.muscleGroups = muscleGroups;
            exercise.unit = unit;

            obj.push(exercise);
          }
        });

        this.onExercisesChanged.next(obj);
        resolve(obj);
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
              let set;
              if (item.time !== undefined && item.time !== null) {
                set = new SingleExerciseSet();
                set.time = item.time;
              } else {
                set = new SingleExerciseSet(item.reps, item.weight);
              }
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
            const unit = doc.data().unit;
            const exercise = new Exercise(id, title);
            exercise.unit = unit;
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

  addExercise(exercise: Exercise) {
    const uid = this.authenticationService.getCurrentUser().uid;
    exercise.user = uid;
    const docRef = this.firestore.collection('Exercise');
    const castedMuscleGroups = exercise.muscleGroups.map((obj) =>
      Object.assign({}, obj)
    );

    docRef
      .add({
        exerciseType: exercise.exerciseType,
        user: exercise.user,
        title: exercise.title,
        unit: exercise.unit,
        muscleGroups: exercise.muscleGroups,
      })
      .then((doc) => {
        const test = '';
      })
      .catch((error: any) => {
        const bla = '';
      });
  }
}

export class MuscleGroup {
  constructor(public id: string, public title: string) {}
}
