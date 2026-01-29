import { Field, InputType } from 'type-graphql';

@InputType()
export class RegisterInput {
  @Field(() => String)
  name!: string;

  @Field(() => String)
  email!: string;

  @Field(() => String)
  password!: string;
}

@InputType()
export class LoginInput {
  @Field(() => String)
  email!: string;

  @Field(() => String)
  password!: string;
}

/**
 * Input for refreshing tokens.
 * The refresh token is passed in the body (not via Authorization header).
 */
@InputType()
export class RefreshTokenInput {
  @Field(() => String)
  refreshToken!: string;
}
