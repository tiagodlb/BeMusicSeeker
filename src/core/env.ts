import {t} from "elysia";

enum DevelopmentEnv {
    Dev = 'development',
    Production = 'production'
}

const envSchema = t.Object({
    DEVELOPMENT_ENV: t.Enum(DevelopmentEnv),
    JWTSECRET: t.String({minLength:8 })
})

export type EnvSchema = typeof envSchema.static;