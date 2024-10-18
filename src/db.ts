import { IUser } from "./model/user";

let users: IUser[] = [];

async function getUsers(): Promise<IUser[]> {
  return users;
}

async function getUserById(id: string): Promise<IUser | undefined> {
  return users.find((user) => user.id === id);
}

async function addUser(user: IUser): Promise<void> {
  users.push(user);
}

async function updateUser(
  id: string,
  updatedUser: IUser
): Promise<IUser | undefined> {
  const existingUser = await getUserById(id);
  if (existingUser) {
    Object.assign(existingUser, updatedUser);
    return updatedUser;
  } else {
    return undefined;
  }
}

async function deleteUser(id: string): Promise<boolean> {
  const index = users.findIndex((user) => user.id === id);
  if (index === -1) return false;
  users.splice(index, 1);
  return true;
}

export { getUsers, addUser, updateUser, deleteUser, getUserById };
