import { IncomingMessage, ServerResponse } from "http";
import * as db from "../db";
import { validate } from "uuid";
import { createUser } from "../model/user";
import { parseRequestBody } from "../utils/parseReqBody";

const getAllUsers = async (req: IncomingMessage, res: ServerResponse) => {
  try {
    const allUsers = await db.getUsers();
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
    const user = await db.getUserById(userId);
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
      const newUser = createUser(username, age, hobbies);
      await db.addUser(newUser);
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
  try {
    parseRequestBody(req, async (body) => {
      const updatedUser = await db.updateUser(userId, body);
      if (!updatedUser) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "User not found" }));
      } else {
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
    const deletedUser = await db.deleteUser(userId);
    if (!deletedUser) {
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
