import { betterAuth } from "better-auth";
import { PostgresDialect } from "kysely";
import { openAPI } from 'better-auth/plugins'
import { Pool } from "pg";

const dialect = new PostgresDialect({
  pool: new Pool({
    // database: "bemusicseeker",
    // host: "localhost",
    // user: "postgres",
    // password: "postgres",
    // port: 51213,
    // max: 10,
    connectionString: process.env.DATABASE_URL,
    ssl: false, 
    
  }),
});

export const auth = betterAuth({
  plugins: [openAPI()],
  trustedOrigins: ["http://localhost:3001"], 
  basePath: 'api',
  database: dialect,
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  sendResetPassword: async ({ user, url }) => {
      // TODO: integrar com serviço de email (resend, nodemailer, etc)
      // por enquanto, loga no console para desenvolvimento
      console.log(`
========================================
RESET PASSWORD REQUEST
========================================
User: ${user.email}
Reset URL: ${url}
========================================
      `);
      
      // Exemplo com Resend:
      // await resend.emails.send({
      //   from: 'BeMusicShare <noreply@bemusicshare.com>',
      //   to: user.email,
      //   subject: 'Recuperar sua senha - BeMusicShare',
      //   html: `
      //     <h1>Recuperação de Senha</h1>
      //     <p>Você solicitou a recuperação de senha.</p>
      //     <a href="${url}">Clique aqui para redefinir sua senha</a>
      //     <p>Este link expira em 1 hora.</p>
      //   `
      // });
    },
  },
});

let _schema: ReturnType<typeof auth.api.generateOpenAPISchema>
const getSchema = async () => (_schema ??= auth.api.generateOpenAPISchema())

export const OpenAPI = {
    getPaths: (prefix = '/auth/api') =>
        getSchema().then(({ paths }) => {
            const reference: typeof paths = Object.create(null)

            for (const path of Object.keys(paths)) {
                const key = prefix + path
                reference[key] = paths[path]!

                for (const method of Object.keys(paths[path]!)) {
                    const operation = (reference[key] as any)[method]

                    operation.tags = ['Better Auth']
                }
            }

            return reference
        }) as Promise<any>,
    components: getSchema().then(({ components }) => components) as Promise<any>
} as const