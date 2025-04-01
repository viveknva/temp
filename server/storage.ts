import { users, type User, type InsertUser, exercises, type Exercise, type InsertExercise } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Exercise related methods
  getAllExercises(): Promise<Exercise[]>;
  getExerciseById(id: string): Promise<Exercise | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private exercises: Map<string, Exercise>;
  currentId: number;

  constructor() {
    this.users = new Map();
    this.exercises = new Map();
    this.currentId = 1;
    
    // Initialize with default breathing exercises
    this.initializeExercises();
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAllExercises(): Promise<Exercise[]> {
    return Array.from(this.exercises.values());
  }

  async getExerciseById(id: string): Promise<Exercise | undefined> {
    return this.exercises.get(id);
  }

  private initializeExercises() {
    const defaultExercises: Exercise[] = [
      {
        id: "box-breathing",
        name: "Box Breathing",
        description: "Inhale, Hold, Exhale, Hold",
        colorTheme: "primary",
        steps: {
          inhale: 4,
          hold1: 4,
          exhale: 4,
          hold2: 4
        }
      },
      {
        id: "4-7-8",
        name: "4-7-8 Technique",
        description: "Relaxation breath",
        colorTheme: "secondary",
        steps: {
          inhale: 4,
          hold1: 7,
          exhale: 8,
          hold2: 0
        }
      },
      {
        id: "deep-calm",
        name: "Deep Calm",
        description: "Stress relief breathing",
        colorTheme: "accent",
        steps: {
          inhale: 6,
          hold1: 2,
          exhale: 7,
          hold2: 0
        }
      },
      {
        id: "energizing",
        name: "Energizing Breath",
        description: "Morning activation",
        colorTheme: "success",
        steps: {
          inhale: 2,
          hold1: 0,
          exhale: 2,
          hold2: 0
        }
      }
    ];

    defaultExercises.forEach(exercise => {
      this.exercises.set(exercise.id, exercise);
    });
  }
}

export const storage = new MemStorage();
