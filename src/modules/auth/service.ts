import { status } from "elysia";
import { AuthModel } from "./model";
import { AuthRepository } from "@/db/repositories/auth";
import { privateKey, publicKey } from "../../core/utils";

const db = new PrismaClient();

export interface JWTService {
  sign(payload: Record<string, any>): Promise<string>;
  verify(token?: string): Promise<false | Record<string, any>>;
}

export abstract class AuthService {
  /**
   * Registra um novo usuário no sistema.
   * @param userData Dados do usuário validados pelo DTO.
   */
  static async register(userData: AuthModel.RegisterUserDto) {
    const { name, email, password, companyId, managementId, matricula } =
      userData;

    const existingUserByEmail = await AuthRepository.findUnique({
      email: email,
    });

    if (existingUserByEmail) {
      throw status(
        409,
        "Este email já está em uso." satisfies AuthModel.RegisterInvalidEmail
      );
    }

    const existingUserByMatricula = await AuthRepository.findFirst({
      matricula: matricula,
      companyId: companyId,
    });
    if (existingUserByMatricula) {
      throw status(
        409,
        "Esta matrícula já está em uso nesta empresa." satisfies AuthModel.RegisterInvalidMatricula
      );
    }

    const companyIdExists = await AuthRepository.findFirst({
      companyId
    })
    if (companyIdExists === null) {
      throw status(
        404,
        "Esta empresa não existe." satisfies AuthModel.RegisterInvalidCompanyId
      );
    }

    const managementIdExists = await AuthRepository.findFirst({
      managementId
    })
    if (managementIdExists === null) {
      throw status(
        404,
        "Esta coordenação não existe." satisfies AuthModel.RegisterInvalidManagementId
      );
    }

    // Recommended parameters for argon2id type according to the
    // [OWASP cheat sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html).
    const passwordHash = await Bun.password.hash(password, {
      algorithm: "argon2id",
      memoryCost: 3,
      timeCost: 12,
    });

    const user = await db.user.create({
      data: {
        name,
        email,
        passwordHash,
        companyId,
        managementId,
        matricula,
        role: "ANALISTA",
        status: "PENDING",
      },
    });

    return {
      email,
      name,
      role: user.role,
      status: user.status
    };
  }

  static async signIn(
    jwt: JWTService,
    { email, password }: AuthModel.signInBody
  ): Promise<AuthModel.signInResponse> {
    const user = await AuthRepository.findUnique({ email: email });

    if (!user) {
      throw status(
        400,
        "Invalid email or password" satisfies AuthModel.signInInvalid
      );
    }

    const verifyPassword = await Bun.password.verify(
      password,
      user.passwordHash
    );

    if (!verifyPassword) {
      throw status(
        400,
        "Invalid email or password" satisfies AuthModel.signInInvalid
      );
    }

    const jwtToken = await jwt.sign({ email });

    const jwe = await new jose.EncryptJWT({ token: jwtToken, email })
      .setProtectedHeader({ alg: "RSA-OAEP-256", enc: "A256GCM" })
      .encrypt(publicKey);

    await this.validateSession(jwe, jwt);

    return {
      token: { value: jwe },
      user: {
        email: user.email,
        role: user.role,
      },
    };
  }

  static async validateSession(
    encryptedToken: string,
    jwt: JWTService
  ): Promise<string | null> {
    try {
      const { payload } = await jose.jwtDecrypt(encryptedToken, privateKey);

      const jwtToken = (payload as any).token;

      if (!jwtToken) {
        console.error("Unauthorized - Invalid or missing token");
        throw status(401, "Unauthorized - Invalid or missing token");
      }

      const verifiedPayload = await jwt.verify(jwtToken);

      if (!verifiedPayload) {
        console.error("Invalid JWT payload");
        throw status(401, "Unauthorized - Invalid or missing token");
      }

      return (verifiedPayload.email as string) || null;
    } catch (error) {
      console.error("Token validation error:", error);
      throw status(401, "Unauthorized - Invalid or missing token");
    }
  }

  static async profile(email: string) {
    return await AuthRepository.findUnique({ email });
  }

  static async logout(encryptedToken: string): Promise<{ message: string }> {
    try {
      this.blacklist.add(encryptedToken);
      return {
        message: "User logged out successfully",
      };
    } catch (error) {
      console.error("Logout error", error);
      throw status(500, "Logout Failed");
    }
  }

  static async refreshToken(
    encryptedToken: string,
    jwt: JWTService
  ): Promise<{ token: string; expiresIn: string }> {
    try {
      if (await this.blacklist.has(encryptedToken)) {
        throw status(401, "Token has been revoked");
      }

      const userData = await this.validateSession(encryptedToken, jwt);

      if (!userData) {
        throw status(401, "Invalid Token");
      }

      const user = await AuthRepository.findUnique({ email: userData });

      if (!user) {
        throw status(401, "User not found");
      }

      const token = await jwt.sign({
        id: user.id,
        email: user.email,
        role: user.role,
        exp: Math.floor(Date.now() / 1000) + 1 * 24 * 60 * 60, // 7 dias
      });

      const newJwe = await new jose.EncryptJWT({
        token: token,
        email: user.email,
        id: user.id,
        role: user.role,
      })
        .setProtectedHeader({ alg: "RSA-OAEP-256", enc: "A256GCM" })
        .encrypt(publicKey);

      this.blacklist.add(encryptedToken);

      return {
        token: newJwe,
        expiresIn: "1d",
      };
    } catch (error) {
      console.error("Error when refreshing user token");
      if (error instanceof Error && "status" in error) {
        throw error;
      }
      throw status(401, "Token refresh failed");
    }
  }

  static async isTokenBlackListed(token: string): Promise<boolean> {
    return await this.blacklist.has(token);
  }

  static async clearBlacklistedToken(token: string): Promise<void> {
    return await this.blacklist.clear(token);
  }
}
