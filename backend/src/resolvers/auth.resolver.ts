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
}
