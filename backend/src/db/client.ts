import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";
import type { DB } from "./types";

const connectionString = process.env.DATABASE_URL;

const dialect = new PostgresDialect({
  pool: new Pool({
    connectionString,
    max: 10,
  }),
});

export const prisma = new Kysely<DB>({
  dialect,
});