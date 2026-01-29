/* eslint-disable */
import * as types from './graphql';



/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  mutation Login($input: LoginInput!) {\n    login(input: $input) {\n      token\n      refreshToken\n      user {\n        id\n        name\n        email\n        createdAt\n        updatedAt\n      }\n    }\n  }\n": typeof types.LoginDocument,
    "\n  mutation Register($input: RegisterInput!) {\n    register(input: $input) {\n      token\n      refreshToken\n      user {\n        id\n        name\n        email\n        createdAt\n        updatedAt\n      }\n    }\n  }\n": typeof types.RegisterDocument,
    "\n  mutation RefreshToken($input: RefreshTokenInput!) {\n    refreshToken(input: $input) {\n      token\n      refreshToken\n    }\n  }\n": typeof types.RefreshTokenDocument,
    "\n  query Categories {\n    categories {\n      items {\n        id\n        title\n        icon\n        color\n        description\n        transactionCount\n      }\n    }\n  }\n": typeof types.CategoriesDocument,
    "\n  mutation CreateCategory($input: CreateCategoryInput!) {\n    createCategory(input: $input) {\n      id\n      title\n      icon\n      color\n      description\n      transactionCount\n    }\n  }\n": typeof types.CreateCategoryDocument,
    "\n  mutation UpdateCategory($input: UpdateCategoryInput!) {\n    updateCategory(input: $input) {\n      id\n      title\n      icon\n      color\n      description\n      transactionCount\n    }\n  }\n": typeof types.UpdateCategoryDocument,
    "\n  mutation DeleteCategory($input: DeleteByIdInput!) {\n    deleteCategory(input: $input)\n  }\n": typeof types.DeleteCategoryDocument,
    "\n  query DashboardSummary($month: Int!, $year: Int!) {\n    dashboardSummary(month: $month, year: $year) {\n      balanceCents\n      incomeMonthCents\n      expenseMonthCents\n    }\n  }\n": typeof types.DashboardSummaryDocument,
    "\n  query Transactions(\n    $filters: TransactionFiltersInput\n    $pagination: PaginationInput\n  ) {\n    transactions(filters: $filters, pagination: $pagination) {\n      items {\n        id\n        type\n        description\n        amountCents\n        date\n        categoryId\n        category {\n          id\n          title\n          color\n          icon\n        }\n        userId\n        createdAt\n        updatedAt\n      }\n      total\n      page\n      perPage\n    }\n  }\n": typeof types.TransactionsDocument,
    "\n  mutation CreateTransaction($input: CreateTransactionInput!) {\n    createTransaction(input: $input) {\n      id\n      type\n      description\n      amountCents\n      date\n      categoryId\n      userId\n      createdAt\n      updatedAt\n    }\n  }\n": typeof types.CreateTransactionDocument,
    "\n  mutation UpdateTransaction($input: UpdateTransactionInput!) {\n    updateTransaction(input: $input) {\n      id\n      type\n      description\n      amountCents\n      date\n      categoryId\n      userId\n      createdAt\n      updatedAt\n    }\n  }\n": typeof types.UpdateTransactionDocument,
    "\n  mutation DeleteTransaction($input: DeleteByIdInput!) {\n    deleteTransaction(input: $input)\n  }\n": typeof types.DeleteTransactionDocument,
};
const documents: Documents = {
    "\n  mutation Login($input: LoginInput!) {\n    login(input: $input) {\n      token\n      refreshToken\n      user {\n        id\n        name\n        email\n        createdAt\n        updatedAt\n      }\n    }\n  }\n": types.LoginDocument,
    "\n  mutation Register($input: RegisterInput!) {\n    register(input: $input) {\n      token\n      refreshToken\n      user {\n        id\n        name\n        email\n        createdAt\n        updatedAt\n      }\n    }\n  }\n": types.RegisterDocument,
    "\n  mutation RefreshToken($input: RefreshTokenInput!) {\n    refreshToken(input: $input) {\n      token\n      refreshToken\n    }\n  }\n": types.RefreshTokenDocument,
    "\n  query Categories {\n    categories {\n      items {\n        id\n        title\n        icon\n        color\n        description\n        transactionCount\n      }\n    }\n  }\n": types.CategoriesDocument,
    "\n  mutation CreateCategory($input: CreateCategoryInput!) {\n    createCategory(input: $input) {\n      id\n      title\n      icon\n      color\n      description\n      transactionCount\n    }\n  }\n": types.CreateCategoryDocument,
    "\n  mutation UpdateCategory($input: UpdateCategoryInput!) {\n    updateCategory(input: $input) {\n      id\n      title\n      icon\n      color\n      description\n      transactionCount\n    }\n  }\n": types.UpdateCategoryDocument,
    "\n  mutation DeleteCategory($input: DeleteByIdInput!) {\n    deleteCategory(input: $input)\n  }\n": types.DeleteCategoryDocument,
    "\n  query DashboardSummary($month: Int!, $year: Int!) {\n    dashboardSummary(month: $month, year: $year) {\n      balanceCents\n      incomeMonthCents\n      expenseMonthCents\n    }\n  }\n": types.DashboardSummaryDocument,
    "\n  query Transactions(\n    $filters: TransactionFiltersInput\n    $pagination: PaginationInput\n  ) {\n    transactions(filters: $filters, pagination: $pagination) {\n      items {\n        id\n        type\n        description\n        amountCents\n        date\n        categoryId\n        category {\n          id\n          title\n          color\n          icon\n        }\n        userId\n        createdAt\n        updatedAt\n      }\n      total\n      page\n      perPage\n    }\n  }\n": types.TransactionsDocument,
    "\n  mutation CreateTransaction($input: CreateTransactionInput!) {\n    createTransaction(input: $input) {\n      id\n      type\n      description\n      amountCents\n      date\n      categoryId\n      userId\n      createdAt\n      updatedAt\n    }\n  }\n": types.CreateTransactionDocument,
    "\n  mutation UpdateTransaction($input: UpdateTransactionInput!) {\n    updateTransaction(input: $input) {\n      id\n      type\n      description\n      amountCents\n      date\n      categoryId\n      userId\n      createdAt\n      updatedAt\n    }\n  }\n": types.UpdateTransactionDocument,
    "\n  mutation DeleteTransaction($input: DeleteByIdInput!) {\n    deleteTransaction(input: $input)\n  }\n": types.DeleteTransactionDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation Login($input: LoginInput!) {\n    login(input: $input) {\n      token\n      refreshToken\n      user {\n        id\n        name\n        email\n        createdAt\n        updatedAt\n      }\n    }\n  }\n"): typeof import('./graphql').LoginDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation Register($input: RegisterInput!) {\n    register(input: $input) {\n      token\n      refreshToken\n      user {\n        id\n        name\n        email\n        createdAt\n        updatedAt\n      }\n    }\n  }\n"): typeof import('./graphql').RegisterDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation RefreshToken($input: RefreshTokenInput!) {\n    refreshToken(input: $input) {\n      token\n      refreshToken\n    }\n  }\n"): typeof import('./graphql').RefreshTokenDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Categories {\n    categories {\n      items {\n        id\n        title\n        icon\n        color\n        description\n        transactionCount\n      }\n    }\n  }\n"): typeof import('./graphql').CategoriesDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateCategory($input: CreateCategoryInput!) {\n    createCategory(input: $input) {\n      id\n      title\n      icon\n      color\n      description\n      transactionCount\n    }\n  }\n"): typeof import('./graphql').CreateCategoryDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateCategory($input: UpdateCategoryInput!) {\n    updateCategory(input: $input) {\n      id\n      title\n      icon\n      color\n      description\n      transactionCount\n    }\n  }\n"): typeof import('./graphql').UpdateCategoryDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteCategory($input: DeleteByIdInput!) {\n    deleteCategory(input: $input)\n  }\n"): typeof import('./graphql').DeleteCategoryDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query DashboardSummary($month: Int!, $year: Int!) {\n    dashboardSummary(month: $month, year: $year) {\n      balanceCents\n      incomeMonthCents\n      expenseMonthCents\n    }\n  }\n"): typeof import('./graphql').DashboardSummaryDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Transactions(\n    $filters: TransactionFiltersInput\n    $pagination: PaginationInput\n  ) {\n    transactions(filters: $filters, pagination: $pagination) {\n      items {\n        id\n        type\n        description\n        amountCents\n        date\n        categoryId\n        category {\n          id\n          title\n          color\n          icon\n        }\n        userId\n        createdAt\n        updatedAt\n      }\n      total\n      page\n      perPage\n    }\n  }\n"): typeof import('./graphql').TransactionsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateTransaction($input: CreateTransactionInput!) {\n    createTransaction(input: $input) {\n      id\n      type\n      description\n      amountCents\n      date\n      categoryId\n      userId\n      createdAt\n      updatedAt\n    }\n  }\n"): typeof import('./graphql').CreateTransactionDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateTransaction($input: UpdateTransactionInput!) {\n    updateTransaction(input: $input) {\n      id\n      type\n      description\n      amountCents\n      date\n      categoryId\n      userId\n      createdAt\n      updatedAt\n    }\n  }\n"): typeof import('./graphql').UpdateTransactionDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteTransaction($input: DeleteByIdInput!) {\n    deleteTransaction(input: $input)\n  }\n"): typeof import('./graphql').DeleteTransactionDocument;


export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}
