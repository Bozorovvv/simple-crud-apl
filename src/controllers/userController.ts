import { IncomingMessage, ServerResponse } from "http";
import { validate } from "uuid";
import { parseRequestBody } from "../utils/parseReqBody";
import { createUser, IUser } from "../model/user";

let users: Map<string, IUser> = new Map();

const getAllUsers = async (req: IncomingMessage, res: ServerResponse) => {
  try {
    const allUsers = Array.from(users.values());
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(allUsers));
  } catch (error) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Internal Server Error" }));
  }
};

const getUserById = async (
  req: IncomingMessage,
  res: ServerResponse,
  userId: string
) => {
  if (!validate(userId)) {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Invalid user ID" }));
    return;
  }
  try {
    const user = users.get(userId);
    if (!user) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "User not found" }));
    } else {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(user));
    }
  } catch (error) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Internal Server Error" }));
  }
};

const createUserHandler = async (req: IncomingMessage, res: ServerResponse) => {
  try {
    parseRequestBody(req, async (body) => {
      const { username, age, hobbies } = body;
      if (!username || typeof age !== "number" || !Array.isArray(hobbies)) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({ message: "Missing or invalid required fields" })
        );
        return;
      }

      if (
        Array.from(users.values()).some((user) => user.username === username)
      ) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Username already exists" }));
        return;
      }

      const newUser: IUser = await createUser(username, age, hobbies);

      users.set(newUser.id, newUser);
      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(JSON.stringify(newUser));
    });
  } catch (error) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Internal Server Error" }));
  }
};

const updateUserHandler = async (
  req: IncomingMessage,
  res: ServerResponse,
  userId: string
) => {
  if (!validate(userId)) {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Invalid user ID" }));
    return;
  }
  try {
    parseRequestBody(req, (body) => {
      const user = users.get(userId);
      if (!user) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "User not found" }));
      } else {
        const updatedUser = { ...user, ...body };
        users.set(userId, updatedUser);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(updatedUser));
      }
    });
  } catch (error) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Internal Server Error" }));
  }
};

const deleteUserHandler = async (
  req: IncomingMessage,
  res: ServerResponse,
  userId: string
) => {
  if (!validate(userId)) {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Invalid user ID" }));
    return;
  }
  try {
    const deleted = users.delete(userId);
    if (!deleted) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "User not found" }));
    } else {
      res.writeHead(204);
      res.end();
    }
  } catch (error) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Internal Server Error" }));
  }
};

export {
  getAllUsers,
  getUserById,
  createUserHandler,
  updateUserHandler,
  deleteUserHandler,
};
