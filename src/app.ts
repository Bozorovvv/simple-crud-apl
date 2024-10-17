import { createServer } from "http";
import {
  createUserHandler,
  deleteUserHandler,
  getAllUsers,
  getUserById,
  updateUserHandler,
} from "./controllers/userController";
import { notFound } from "./utils/notFound";

const server = createServer((req, res) => {
  const { method, url } = req;
  const userId = url?.split("/")[3];

  if (url === "/api/users" && method === "GET") {
    getAllUsers(req, res);
  } else if (url?.match(/^\/api\/users\/[\w-]+$/) && method === "GET") {
    getUserById(req, res, userId!);
  } else if (url === "/api/users" && method === "POST") {
    createUserHandler(req, res);
  } else if (url?.match(/^\/api\/users\/[\w-]+$/) && method === "PUT") {
    updateUserHandler(req, res, userId!);
  } else if (url?.match(/^\/api\/users\/[\w-]+$/) && method === "DELETE") {
    deleteUserHandler(req, res, userId!);
  } else {
    notFound(req, res);
  }
});

export default server;
