import { users, type User, type InsertUser } from "../shared/schema.js";

// modify the interface with any CRUD methods
// you might need

export class MemStorage {
  private users: Map<number, User>;
  private currentId: number;

  constructor() {
    this.users = new Map();
    this.currentId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: Omit<InsertUser, 'id'>): Promise<User> {
    const id = this.currentId++;
    const user = { ...insertUser, id } as User;
    this.users.set(id, user);
    return user;
  }
}

export const storage = new MemStorage();