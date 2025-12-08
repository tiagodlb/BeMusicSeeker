import Elysia from "elysia";
import jwt from "@elysiajs/jwt";
import type { EnvSchema } from "../env";

export const auth_guard = new Elysia()
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWTSECRET! satisfies EnvSchema["JWTSECRET"],
    })
  )
  .guard({
    async beforeHandle({ cookie, headers, jwt, status }) {
      const raw =
        cookie.auth?.value ?? headers.authorization?.replace(/^Bearer\s+/, "");

      if (!raw && typeof raw === "string") return status(401, "Missing token.");

      const payload = await jwt.verify(raw as string);

      if (!payload) return status(401, "Invalid token.");

      return { user: payload };
    },
  });
