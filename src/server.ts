import { Elysia } from "elysia"

const server = new Elysia()
  .group('/v1', (app) =>
    app
	    .get('/', 'hi')
  )
  .listen(3000)

console.log("Running on http://localhost:3000")
server.handle(new Request('http://localhost:3000/v1')).then(console.log)
