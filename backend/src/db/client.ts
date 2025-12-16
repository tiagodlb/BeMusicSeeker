import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";
import type { DB } from "./types";

const dialect = new PostgresDialect({
  pool: new Pool({
    database: process.env.DB_NAME || "bemusicseeker",
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "postgres",
    port: parseInt(process.env.DB_PORT || "5432"),
    password: process.env.DB_PASSWORD || "",
    max: 10,
  }),
});

export const prisma = new Kysely<DB>({
  dialect,
});
