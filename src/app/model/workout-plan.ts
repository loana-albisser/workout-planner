
export class WorkoutPlan {
    constructor(
        public id: string = "", 
        public title: string = "",
        public exercises: Array<Exercise> = Array()) {
    }
}

export class Exercise {
    constructor(public id: string, public title: string) {

    }
}
