import { graphql } from "@/graphql/gql";

export const TransactionsQuery = graphql(`
  query Transactions(
    $filters: TransactionFiltersInput
    $pagination: PaginationInput
  ) {
    transactions(filters: $filters, pagination: $pagination) {
      items {
        id
        type
        description
        amountCents
        date
        categoryId
        category {
          id
          title
          color
          icon
        }
        userId
        createdAt
        updatedAt
      }
      total
      page
      perPage
    }
  }
`);

export const CreateTransactionMutation = graphql(`
  mutation CreateTransaction($input: CreateTransactionInput!) {
    createTransaction(input: $input) {
      id
      type
      description
      amountCents
      date
      categoryId
      userId
      createdAt
      updatedAt
    }
  }
`);

export const UpdateTransactionMutation = graphql(`
  mutation UpdateTransaction($input: UpdateTransactionInput!) {
    updateTransaction(input: $input) {
      id
      type
      description
      amountCents
      date
      categoryId
      userId
      createdAt
      updatedAt
    }
  }
`);

export const DeleteTransactionMutation = graphql(`
  mutation DeleteTransaction($input: DeleteByIdInput!) {
    deleteTransaction(input: $input)
  }
`);
