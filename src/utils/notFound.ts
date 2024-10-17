import { IncomingMessage, ServerResponse } from "http";

export function notFound(req: IncomingMessage, res: ServerResponse) {
  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ message: "Endpoint not found" }));
}
