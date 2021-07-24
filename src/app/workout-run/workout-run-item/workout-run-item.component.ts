import { element } from 'protractor';
import { Component, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ExerciseSet } from '../../model/workout-plan';
import { Animation, AnimationController } from '@ionic/angular';

@Component({
  selector: 'app-workout-run-item',
  templateUrl: './workout-run-item.component.html',
  styleUrls: ['./workout-run-item.component.scss'],
})
export class WorkoutRunItemComponent implements OnInit {
  @Input() exerciseSet: ExerciseSet;
  @ViewChildren('exerciseRow') row: QueryList<any>;
  @ViewChildren('container') container: QueryList<any>;

  constructor(private animationCtrl: AnimationController) { }

  ngOnInit() {}

  exerciseCheckChanged(checked: boolean, index: number) {
    if (checked) {
      const rowElement = this.row.get(index).el;
      const animation = this.animationCtrl.create()
      .addElement(rowElement)
      .duration(300)
      .iterations(1)
      .keyframes([
        { offset: 0, background: 'var(--ion-card-background)', transform: 'scale(1)' },
        { offset: 0.72, background: 'var(--ion-color-primary-transparent-20)', transform: 'scale(1.1)' },
        { offset: 1, background: 'var(--ion-color-primary-transparent-20)', transform: 'scale(1)' }
      ]);
      animation.play();
      const finished = Array();
      this.exerciseSet.exerciseSets.forEach(item => {
        if(item.finished === true) {
          finished.push(item);
        }
      });
      if (finished.length === this.exerciseSet.exerciseSets.length) {
        const container = this.container.first.el;
        const finishedAnimation = this.animationCtrl.create()
        .addElement(container)
        .duration(300)
        .iterations(1)
        .keyframes([
          { offset: 0, background: 'var(--ion-card-background)', transform: 'scale(1)', opacity: '1' },
          { offset: 0.72, background: 'var(--ion-color-primary-transparent-20)', transform: 'scale(1.1)', opacity: '0.4' },
          { offset: 1, background: 'var(--ion-color-primary-transparent-20)', transform: 'scale(1)' , opacity: '0.4'}
        ]);
        finishedAnimation.play();
      }

    } else {
      const rowElement = this.row.get(index).el;
      const animation = this.animationCtrl.create()
      .addElement(rowElement)
      .duration(300)
      .iterations(1)
      .fromTo('background', 'var(--ion-color-primary-transparent-20)', 'var(--ion-card-background)');
      animation.play();

      const container = this.container.first.el;
        const finishedAnimation = this.animationCtrl.create()
        .addElement(container)
        .duration(300)
        .iterations(1)
        .to('opacity', '1')
        .to('background','var(--ion-card-background)');
        finishedAnimation.play();
    }
  }

}
