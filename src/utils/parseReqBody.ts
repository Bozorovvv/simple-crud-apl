import { IncomingMessage } from "http";

export const parseRequestBody = (
  req: IncomingMessage,
  callback: (body: any) => void
) => {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });
  req.on("end", () => {
    try {
      callback(JSON.parse(body));
    } catch {
      callback({});
    }
  });
};
