import { Elysia } from "elysia"

const app = new Elysia()
  .get('/', () => 'Hello from Elysia')
  .listen(3000);

console.log(`elysia is running at ${app.server?.hostname}:${app.server?.port}\n`);
