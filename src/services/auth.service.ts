import type {
  LoginInput,
  RegisterInput,
} from '@/graphql/dtos/inputs/auth.input.js';
import type { AuthOutput } from '@/graphql/dtos/outputs/auth.output.js';
import type { UserModel } from '@/graphql/models/user.model.js';
import { prismaClient } from '@/lib/prisma.js';
import { comparePassword, hashPassword } from '@/utils/hash.js';
import { signJwt } from '@/utils/jwt.js';

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
        ...data,
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
