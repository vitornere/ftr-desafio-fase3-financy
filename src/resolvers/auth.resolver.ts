import { Arg, Mutation, Resolver } from 'type-graphql';
import { LoginInput, RegisterInput } from '@/graphql/dtos/inputs/auth.input.js';
import { AuthOutput } from '@/graphql/dtos/outputs/auth.output.js';
import { AuthService } from '@/services/auth.service.js';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {
    this.authService = new AuthService();
  }

  @Mutation(() => AuthOutput)
  async register(
    @Arg('data', () => RegisterInput) data: RegisterInput,
  ): Promise<AuthOutput> {
    return this.authService.register(data);
  }

  @Mutation(() => AuthOutput)
  async login(
    @Arg('data', () => LoginInput) data: LoginInput,
  ): Promise<AuthOutput> {
    return this.authService.login(data);
  }
}
