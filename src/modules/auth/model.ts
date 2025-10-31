import { t } from "elysia";

export namespace AuthModel {
  export const validBody = t.Object({
    valid: t.Boolean({}),
    user: t.Object({
      email: t.String({
        format: "email",
        error: "O formato do email é inválido"
      }),
      role: t.String({})
    })
  })
  export const registerUserBody = t.Object({
    name: t.String({ minLength: 3 }),
    email: t.String({
      format: "email",
      error: "O formato do e-mail é inválido",
    }),
    password: t.String({
      minLength: 8,
      error: "A senha deve ter no mínimo 8 caracteres",
    }),
    companyId: t.String({ error: "O ID da empresa é obrigatório." }),
    managementId: t.String({ error: "O ID da gerência é obrigatório." }),
    matricula: t.String({
      minLength: 6,
      maxLength: 6,
      error: "A matrícula deve ter 6 caracteres.",
    }),
  });

  export type RegisterUserDto = typeof registerUserBody.static;
  export const RegisterInvalidEmail = t.Literal("Este email já está em uso.");
  export type RegisterInvalidEmail = typeof RegisterInvalidEmail.static;
  export const RegisterInvalidMatricula = t.Literal(
    "Esta matrícula já está em uso nesta empresa."
  );
  export type RegisterInvalidMatricula = typeof RegisterInvalidMatricula.static;
  export const RegisterInvalidCompanyId = t.Literal(
    "Esta empresa não existe."
  );
  export type RegisterInvalidCompanyId = typeof RegisterInvalidCompanyId.static;
  export const RegisterInvalidManagementId = t.Literal(
    "Esta coordenação não existe."
  );
  export type RegisterInvalidManagementId = typeof RegisterInvalidManagementId.static;

  export const loginUserBody = t.Object({
    email: t.String({
      format: "email",
      error: "O formato do e-mail é inválido.",
    }),
    password: t.String({ error: "A senha é obrigatória." }),
  });

  export const signInResponse = t.Object({
    token: t.Object({
      value: t.String(),
    }),
    user: t.Object({
      email: t.String(),
      role: t.String(),
    }),
  });

  export type signInResponse = typeof signInResponse.static;
  export type signInBody = typeof loginUserBody.static;
  export const signInInvalid = t.Literal('Invalid email or password')
  export type signInInvalid = typeof signInInvalid.static
  export const LoginInvalidUser = t.Literal("Este usuário não existe");
  export type LoginInvalidUser = typeof LoginInvalidUser.static;
  export const LoginInvalidForbidden = t.Literal("Email ou Senha incorretos.");
  export type LoginInvalidForbidden = typeof LoginInvalidForbidden.static;
}