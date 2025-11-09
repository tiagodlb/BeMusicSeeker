import { Elysia } from "elysia";
import { OpenAPI } from "./core/auth/auth";
import { openapi } from "@elysiajs/openapi";
import { cors } from "@elysiajs/cors";
import { betterAuth } from "./core/auth/macro";

const server = new Elysia()
  .use(
    openapi({
      documentation: {
        components: await OpenAPI.components,
        paths: await OpenAPI.getPaths(),
      },
    })
  )
  .use(
    cors({
      origin: "http://localhost:3001",
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  )
  .group("/v1", (app) =>
    app
      .use(betterAuth)
      .get("/", "hi\n")
      .get("/user", ({ user }) => user, {
        auth: true,
      })
  )
  .listen(3000);

console.log("Running on http://localhost:3000");