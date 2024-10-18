import { v4 as uuidv4 } from "uuid";

export interface IUser {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
}

export async function createUser(
  username: string,
  age: number,
  hobbies: string[]
): Promise<IUser> {
  return { id: uuidv4(), username, age, hobbies };
}
