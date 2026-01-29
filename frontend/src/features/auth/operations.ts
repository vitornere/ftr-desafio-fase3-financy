import { graphql } from "@/graphql/gql";

export const LoginMutation = graphql(`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      token
      refreshToken
      user {
        id
        name
        email
        createdAt
        updatedAt
      }
    }
  }
`);

export const RegisterMutation = graphql(`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      token
      refreshToken
      user {
        id
        name
        email
        createdAt
        updatedAt
      }
    }
  }
`);

/**
 * Refresh tokens mutation.
 * Called with the current refresh token to get new access and refresh tokens.
 * Does NOT require Authorization header.
 */
export const RefreshTokenMutation = graphql(`
  mutation RefreshToken($input: RefreshTokenInput!) {
    refreshToken(input: $input) {
      token
      refreshToken
    }
  }
`);

/**
 * Get the currently authenticated user.
 * Returns null if not authenticated.
 */
export const UserMeQuery = graphql(`
  query UserMe {
    userMe {
      id
      name
      email
      createdAt
      updatedAt
    }
  }
`);
