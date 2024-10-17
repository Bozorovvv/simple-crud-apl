import { IUser } from "./model/user";

class UserDataBase {
  private users: IUser[] = [];

  getUsers(): IUser[] {
    return this.users;
  }
  getUserById(id: string): IUser | undefined {
    return this.users.find((user) => user.id === id);
  }
  addUser(user: IUser): void {
    this.users.push(user);
  }

  updateUser(id: string, updatedUser: IUser): IUser | undefined {
    const existingUser = this.getUserById(id);
    if (existingUser) {
      Object.assign(existingUser, updatedUser);
      return updatedUser;
    } else {
      return undefined;
    }
  }

  deleteUser(id: string): boolean {
    const index = this.users.findIndex((user) => user.id === id);
    if (index === -1) return false;
    this.users.splice(index, 1);
    return true;
  }
}

export const db = new UserDataBase();
