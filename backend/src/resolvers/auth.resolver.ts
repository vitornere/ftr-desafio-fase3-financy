import { Arg, Mutation, Resolver } from 'type-graphql';
import {
  LoginInput,
  RefreshTokenInput,
  RegisterInput,
} from '@/graphql/dtos/inputs/auth.input.js';
import {
  AuthOutput,
  RefreshOutput,
} from '@/graphql/dtos/outputs/auth.output.js';
import { AuthService } from '@/services/auth.service.js';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {
    this.authService = new AuthService();
  }

  @Mutation(() => AuthOutput)
  async register(
    @Arg('input', () => RegisterInput) input: RegisterInput,
  ): Promise<AuthOutput> {
    return this.authService.register(input);
  }

  @Mutation(() => AuthOutput)
  async login(
    @Arg('input', () => LoginInput) input: LoginInput,
  ): Promise<AuthOutput> {
    return this.authService.login(input);
  }

  /**
   * Refresh tokens using a valid refresh token.
   * Does NOT require Authorization header - uses the refresh token from input.
   * Returns new access token and rotated refresh token.
   */
  @Mutation(() => RefreshOutput)
  async refreshToken(
    @Arg('input', () => RefreshTokenInput) input: RefreshTokenInput,
  ): Promise<RefreshOutput> {
    return this.authService.refresh(input);
  }
}
