import { graphql } from "@/graphql/gql"

/**
 * Query to check if dev seed is enabled on the server.
 */
export const IsDevSeedEnabledQuery = graphql(`
  query IsDevSeedEnabled {
    isDevSeedEnabled
  }
`)

/**
 * Mutation to seed development data.
 */
export const SeedDevDataMutation = graphql(`
  mutation SeedDevData($input: SeedDevDataInput!) {
    seedDevData(input: $input) {
      categoriesCreated
      transactionsCreated
    }
  }
`)
