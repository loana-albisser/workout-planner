import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WorkoutPlanExerciseSetItemComponent } from './workout-plan-exercise-set-item.component';

describe('WorkoutPlanExerciseSetItemComponent', () => {
  let component: WorkoutPlanExerciseSetItemComponent;
  let fixture: ComponentFixture<WorkoutPlanExerciseSetItemComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkoutPlanExerciseSetItemComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(WorkoutPlanExerciseSetItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
