import { Elysia } from "elysia";
import { OpenAPI } from "./core/auth/auth";
import { openapi } from "@elysiajs/openapi";
import { staticPlugin } from "@elysiajs/static";
import { cors } from "@elysiajs/cors";
import { betterAuth } from "./core/auth/macro";
import { recommendationRoutes } from "./nova-recomendacao/controller";
import { userRoutes } from "./modules/perfil";
import { commentRoutes } from "./modules/comments";
import { favoriteRoutes } from "./modules/favourites";
import { followRoutes } from "./modules/followers";
import { exploreRoutes } from "./modules/explore";
import { notificationRoutes } from "./modules/notifications/controller";

const _server = new Elysia()
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
  .use(staticPlugin({
    assets: "./public",
    prefix: "/"
  }))
  .group("/v1", (app) =>
    app
      .use(betterAuth)
      .use(userRoutes)
      .use(commentRoutes)
      .use(recommendationRoutes)
      .use(favoriteRoutes)
      .use(followRoutes)
      .use(exploreRoutes)
      .use(notificationRoutes)
      .get("/", "hi\n")
      .get("/user", ({ user }) => user, {
        auth: true,
      })
  )
  .listen(3000);

console.log("Running on http://localhost:3000");