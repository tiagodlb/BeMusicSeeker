import { betterAuth } from 'better-auth'
import {  PostgresDialect } from 'kysely'
import { Pool } from 'pg'

const dialect = new PostgresDialect({
  pool: new Pool({
    database: 'bemusicseeker',
    host: 'localhost',
    user: 'postgres', 
    port: 51213,
    max: 10,
  })
})

export const auth = betterAuth({
  database: dialect
})