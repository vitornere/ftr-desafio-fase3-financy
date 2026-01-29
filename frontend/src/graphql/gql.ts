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
    "\n  query Categories {\n    categories {\n      items {\n        id\n        title\n        icon\n        color\n        description\n        transactionCount\n      }\n    }\n  }\n": typeof types.CategoriesDocument,
    "\n  mutation CreateCategory($input: CreateCategoryInput!) {\n    createCategory(input: $input) {\n      id\n      title\n      icon\n      color\n      description\n      transactionCount\n    }\n  }\n": typeof types.CreateCategoryDocument,
    "\n  mutation UpdateCategory($input: UpdateCategoryInput!) {\n    updateCategory(input: $input) {\n      id\n      title\n      icon\n      color\n      description\n      transactionCount\n    }\n  }\n": typeof types.UpdateCategoryDocument,
    "\n  mutation DeleteCategory($input: DeleteByIdInput!) {\n    deleteCategory(input: $input)\n  }\n": typeof types.DeleteCategoryDocument,
};
const documents: Documents = {
    "\n  mutation Login($input: LoginInput!) {\n    login(input: $input) {\n      token\n      refreshToken\n      user {\n        id\n        name\n        email\n        createdAt\n        updatedAt\n      }\n    }\n  }\n": types.LoginDocument,
    "\n  mutation Register($input: RegisterInput!) {\n    register(input: $input) {\n      token\n      refreshToken\n      user {\n        id\n        name\n        email\n        createdAt\n        updatedAt\n      }\n    }\n  }\n": types.RegisterDocument,
    "\n  query Categories {\n    categories {\n      items {\n        id\n        title\n        icon\n        color\n        description\n        transactionCount\n      }\n    }\n  }\n": types.CategoriesDocument,
    "\n  mutation CreateCategory($input: CreateCategoryInput!) {\n    createCategory(input: $input) {\n      id\n      title\n      icon\n      color\n      description\n      transactionCount\n    }\n  }\n": types.CreateCategoryDocument,
    "\n  mutation UpdateCategory($input: UpdateCategoryInput!) {\n    updateCategory(input: $input) {\n      id\n      title\n      icon\n      color\n      description\n      transactionCount\n    }\n  }\n": types.UpdateCategoryDocument,
    "\n  mutation DeleteCategory($input: DeleteByIdInput!) {\n    deleteCategory(input: $input)\n  }\n": types.DeleteCategoryDocument,
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


export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}
