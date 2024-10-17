import { IncomingMessage, ServerResponse } from "http";
import { db } from "../db";
import { validate } from "uuid";
import { createUser } from "../model/user";
import { parseRequestBody } from "../utils/parseReqBody";

export const getAllUsers = (req: IncomingMessage, res: ServerResponse) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(db.getUsers()));
};

export const getUserById = (
  req: IncomingMessage,
  res: ServerResponse,
  userId: string
) => {
  if (!validate(userId)) {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Invalid user ID" }));
  }

  const user = db.getUserById(userId);

  if (!user) {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "User not found" }));
  }

  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(user));
};
// hello

export const createUserHandler = (
  req: IncomingMessage,
  res: ServerResponse
) => {
  parseRequestBody(req, (body) => {
    console.log(body);
    const { username, age, hobbies } = body;

    if (!username || typeof age === "number" || !Array.isArray(hobbies)) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Missing required fields" }));
    }

    const newUser = createUser(username, age, hobbies);
    db.addUser(newUser);
    res.writeHead(201, { "Content-Type": "application/json" });
    res.end(JSON.stringify(newUser));
  });
};

export const updateUserHandler = (
  req: IncomingMessage,
  res: ServerResponse,
  userId: string
) => {
  parseRequestBody(req, (body) => {
    const updatedUser = db.updateUser(userId, body);
    if (!updatedUser) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "User not found" }));
    }

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(updatedUser));
  });
};

export const deleteUserHandler = (
  req: IncomingMessage,
  res: ServerResponse,
  userId: string
) => {
  parseRequestBody(req, (body) => {
    if (!validate(userId)) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Invalid user ID" }));
    }

    const deletedUser = db.deleteUser(userId);
    if (!deletedUser) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "User not found" }));
    }

    res.writeHead(204, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "User deleted successfully" }));
  });
};
