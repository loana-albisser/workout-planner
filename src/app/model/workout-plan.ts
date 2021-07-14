
export class WorkoutPlan {
    constructor(
        public id: string = "", 
        public title: string = "",
        public exerciseSets: Array<ExerciseSet> = Array()) {
    }
}

export class Exercise {
    constructor(public id: string, public title: string) {

    }
}

export class ExerciseSet {
    constructor(public id: string, public exercise: Exercise, public exerciseSets: Array<SingleExerciseSet>) {}
}

export class SingleExerciseSet {
    constructor(public reps: number, public weight: number) {}
}

