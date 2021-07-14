import { capSQLiteSet } from '@capacitor-community/sqlite';
export const createSchema: string = `
CREATE TABLE IF NOT EXISTS workoutPlans (
    id INTEGER PRIMARY KEY NOT NULL,
    title TEXT
)`

const row: Array<Array<any>> = [
    ['Squats Smith Machine'],
    ['Leg Presses'],
  ];

export const defaultWorkoutPlans: string = `
DELETE FROM workoutPlans;
INSERT INTO workoutPlans (title) VALUES ("Workoutplan #1");
INSERT INTO workoutPlans (title) VALUES ("Workoutplan #2");
`;