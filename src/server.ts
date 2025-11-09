import { Elysia } from "elysia";
import { auth_guard } from "./core/security/auth_guards";

const server = new Elysia()
  .group("/v1", (app) => app.use(auth_guard).get("/", "hi"))
  .listen(3000);

console.log("Running on http://localhost:3000");
server.handle(new Request("http://localhost:3000/v1")).then(console.log);
