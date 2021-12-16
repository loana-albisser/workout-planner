import {
  ExerciseTypeEnum,
  UnitEnum,
} from './../add-workout-plan/exercise-add/create-custom-exercise/create-custom-exercise.page';

export class WorkoutPlan {
  constructor(
    public id: string = '',
    public title: string = '',
    private user: string = '',
    public archived: boolean = false,
    public expanded: boolean = false,
    public exerciseSets: Array<ExerciseSet> = Array()
  ) {}
}

export class Exercise {
  exerciseType: ExerciseTypeEnum;
  muscleGroups: Array<string>;
  unit: UnitEnum;
  user: string;
  constructor(public id: string, public title: string) {}
}

export class ExerciseSet {
  constructor(
    public id: string = '',
    public exercise: Exercise,
    public exerciseSets: Array<SingleExerciseSet>,
    public markToImprove: boolean = false
  ) {}
}

export class SingleExerciseSet {
  constructor(
    public reps: number = null,
    public weight: number = null,
    public time: number = null,
    public finished: boolean = false,
  ) {}
}
