import { GraphQLError } from 'graphql';
import type {
  LoginInput,
  RefreshTokenInput,
  RegisterInput,
} from '@/graphql/dtos/inputs/auth.input.js';
import type {
  AuthOutput,
  RefreshOutput,
} from '@/graphql/dtos/outputs/auth.output.js';
import type { UserModel } from '@/graphql/models/user.model.js';
import { prismaClient } from '@/lib/prisma.js';
import { comparePassword, hashPassword } from '@/utils/hash.js';
import { type JwtPayload, signJwt, verifyJwt } from '@/utils/jwt.js';

export class AuthService {
  generateToken(payload: UserModel): { token: string; refreshToken: string } {
    const token = signJwt(
      {
        id: payload.id,
        email: payload.email,
      },
      '15m',
    );
    const refreshToken = signJwt(
      {
        id: payload.id,
        email: payload.email,
      },
      '1d',
    );

    return {
      token,
      refreshToken,
    };
  }

  /**
   * Refresh tokens using a valid refresh token.
   * Returns new access token AND new refresh token (rotation).
   *
   * Note: This implementation uses stateless JWTs. For enhanced security,
   * consider storing refresh tokens in database to enable revocation.
   */
  async refresh(data: RefreshTokenInput): Promise<RefreshOutput> {
    let decoded: JwtPayload;

    try {
      decoded = verifyJwt(data.refreshToken);
    } catch {
      // Token invalid or expired
      throw new GraphQLError('Invalid or expired refresh token', {
        extensions: { code: 'UNAUTHENTICATED' },
      });
    }

    // Verify user still exists
    const user = await prismaClient.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      throw new GraphQLError('User not found', {
        extensions: { code: 'UNAUTHENTICATED' },
      });
    }

    // Generate new tokens (rotation: new refresh token each time)
    const { token, refreshToken } = this.generateToken(user);

    return {
      token,
      refreshToken,
    };
  }

  async register(data: RegisterInput): Promise<AuthOutput> {
    const existingUser = await prismaClient.user.findUnique({
      where: {
        email: data.email,
      },
      select: {
        id: true,
      },
    });

    if (existingUser) {
      throw new Error('User already exists');
    }

    const hashedPassword = await hashPassword(data.password);
    const user = await prismaClient.user.create({
      data: {
        email: data.email,
        name: data.name,
        passwordHash: hashedPassword,
      },
    });

    const { token, refreshToken } = this.generateToken(user);

    return {
      token,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };
  }

  async login(data: LoginInput): Promise<AuthOutput> {
    const user = await prismaClient.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await comparePassword(
      data.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    const { token, refreshToken } = this.generateToken(user);

    return {
      token,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };
  }
}
