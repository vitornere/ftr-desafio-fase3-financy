import { Field, ObjectType } from 'type-graphql';
import { UserModel } from '@/graphql/models/user.model.js';

@ObjectType()
export class AuthOutput {
  @Field(() => String)
  token!: string;

  @Field(() => String)
  refreshToken!: string;

  @Field(() => UserModel)
  user!: UserModel;
}

/**
 * Output for token refresh.
 * Returns new access token and rotated refresh token.
 */
@ObjectType()
export class RefreshOutput {
  @Field(() => String)
  token!: string;

  @Field(() => String)
  refreshToken!: string;
}
