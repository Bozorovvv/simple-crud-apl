import { HttpMethod } from "./types/commonTypes";
import { createServer, IncomingMessage, ServerResponse } from "http";
import {
  createUserHandler,
  deleteUserHandler,
  getAllUsers,
  getUserById,
  updateUserHandler,
} from "./controllers/userController";
import { notFound } from "./utils/notFound";

const server = createServer(
  async (req: IncomingMessage, res: ServerResponse) => {
    const { method, url } = req;

    const isUsersRoute = url?.startsWith("/api/users");
    const userId = url?.split("/")[3] ?? null;

    try {
      switch (method) {
        case HttpMethod.GET:
          if (url === "/api/users") {
            await getAllUsers(req, res);
          } else if (isUsersRoute && userId) {
            await getUserById(req, res, userId);
          } else {
            notFound(req, res);
          }
          break;

        case HttpMethod.POST:
          if (url === "/api/users") {
            await createUserHandler(req, res);
          } else {
            notFound(req, res);
          }
          break;

        case HttpMethod.PUT:
          if (isUsersRoute && userId) {
            await updateUserHandler(req, res, userId);
          } else {
            notFound(req, res);
          }
          break;

        case HttpMethod.DELETE:
          if (isUsersRoute && userId) {
            await deleteUserHandler(req, res, userId);
          } else {
            notFound(req, res);
          }
          break;

        default:
          notFound(req, res);
          break;
      }
    } catch (error) {
      res.statusCode = 500;
      res.end("Internal Server Error");
    }
  }
);

export default server;
