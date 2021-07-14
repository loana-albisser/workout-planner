import { DatabaseProvider } from './../database-provider';
import { WorkoutPlanRepositoryService } from './../workout-plan-repository.service';
import { defaultWorkoutPlans } from './../database-utils';
import { Component, NgZone } from '@angular/core';
import { Platform } from '@ionic/angular';
import { createSchema } from '../database-utils';
import { SQLiteService } from '../sqlite.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  private initPlugin: boolean;

  constructor(private platform: Platform,
    private sqlite: SQLiteService,
    private zone: NgZone,
    private databaseProvider: DatabaseProvider,
    private workoutPlanRepositoryService: WorkoutPlanRepositoryService) {
      this.initializeApp()
    }

    initializeApp() {
      this.platform.ready().then(async () => {
        /* this.sqlite.initializePlugin().then(ret => {
          this.initPlugin = ret;
          console.log('>>>> in App  this.initPlugin ' + this.initPlugin);
          debugger;
          this.openDatabase()
        }); */
        debugger;
        this.retrieveCollection()
      });
    }

    retrieveCollection() : void
   {
      this.databaseProvider.getDocuments("WorkoutPlan")
      .then((data) =>
      {

         // IF we don't have any documents then the collection doesn't exist
         // so we create it!
        
         this.zone.run(() => {
          this.workoutPlanRepositoryService = data
      });

      })
      .catch();
   }

    async openDatabase(){
      let db = await this.sqlite.createConnection("workoutPlan", false, "no-encryption", 1);

      // open db testEncryption
      await db.open();

      // create tables in db
      let ret: any = await db.execute(createSchema);
      if (ret.changes.changes < 0) {
        return Promise.reject(new Error("Execute createSchema failed"));
      }

      // create synchronization table 
      ret = await db.createSyncTable();
      if (ret.changes.changes < 0) {
        return Promise.reject(new Error("Execute createSyncTable failed"));
      }

      ret = await db.execute(defaultWorkoutPlans);
      debugger;
      this.workoutPlanRepositoryService.allWorkoutPlans = ret
    
      if (ret.changes.changes !== 2) {
        return Promise.reject(new Error("Execute twoUsers failed"));
      }
      
    } 
}
