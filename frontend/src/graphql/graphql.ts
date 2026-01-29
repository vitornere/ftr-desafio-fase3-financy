/* eslint-disable */
import type { DocumentTypeDecoration } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = T | null | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar.This scalar is serialized to a string in ISO 8601 format and parsed from a string in ISO 8601 format. */
  DateTimeISO: { input: any; output: any; }
};

export type AuthOutput = {
  __typename?: 'AuthOutput';
  refreshToken: Scalars['String']['output'];
  token: Scalars['String']['output'];
  user: UserModel;
};

export type CategoryListOutput = {
  __typename?: 'CategoryListOutput';
  items: Array<CategoryModel>;
};

export type CategoryModel = {
  __typename?: 'CategoryModel';
  color: Scalars['String']['output'];
  createdAt: Scalars['DateTimeISO']['output'];
  description?: Maybe<Scalars['String']['output']>;
  icon: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  title: Scalars['String']['output'];
  transactionCount?: Maybe<Scalars['Float']['output']>;
  updatedAt: Scalars['DateTimeISO']['output'];
  user: UserModel;
  userId: Scalars['ID']['output'];
};

export type CreateCategoryInput = {
  color: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  icon: Scalars['String']['input'];
  title: Scalars['String']['input'];
};

export type CreateTransactionInput = {
  amountCents: Scalars['Int']['input'];
  categoryId?: InputMaybe<Scalars['ID']['input']>;
  date: Scalars['DateTimeISO']['input'];
  description: Scalars['String']['input'];
  type: TransactionType;
};

export type DashboardSummaryOutput = {
  __typename?: 'DashboardSummaryOutput';
  /** Total balance in cents */
  balanceCents: Scalars['Int']['output'];
  /** Total expenses in cents */
  expenseMonthCents: Scalars['Int']['output'];
  /** Total income in cents */
  incomeMonthCents: Scalars['Int']['output'];
};

export type DeleteByIdInput = {
  id: Scalars['ID']['input'];
};

export type LoginInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createCategory: CategoryModel;
  createTransaction: TransactionModel;
  deleteCategory: Scalars['Boolean']['output'];
  deleteTransaction: Scalars['Boolean']['output'];
  login: AuthOutput;
  register: AuthOutput;
  updateCategory: CategoryModel;
  updateTransaction: TransactionModel;
};


export type MutationCreateCategoryArgs = {
  input: CreateCategoryInput;
};


export type MutationCreateTransactionArgs = {
  input: CreateTransactionInput;
};


export type MutationDeleteCategoryArgs = {
  input: DeleteByIdInput;
};


export type MutationDeleteTransactionArgs = {
  input: DeleteByIdInput;
};


export type MutationLoginArgs = {
  input: LoginInput;
};


export type MutationRegisterArgs = {
  input: RegisterInput;
};


export type MutationUpdateCategoryArgs = {
  input: UpdateCategoryInput;
};


export type MutationUpdateTransactionArgs = {
  input: UpdateTransactionInput;
};

export type PaginationInput = {
  page?: InputMaybe<Scalars['Int']['input']>;
  perPage?: InputMaybe<Scalars['Int']['input']>;
};

export type Query = {
  __typename?: 'Query';
  categories: CategoryListOutput;
  dashboardSummary: DashboardSummaryOutput;
  transactions: TransactionListOutput;
};


export type QueryDashboardSummaryArgs = {
  month: Scalars['Int']['input'];
  year: Scalars['Int']['input'];
};


export type QueryTransactionsArgs = {
  filters?: InputMaybe<TransactionFiltersInput>;
  pagination?: InputMaybe<PaginationInput>;
};

export type RegisterInput = {
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type TransactionFiltersInput = {
  /** Filtrar por categoria (null = sem categoria) */
  categoryId?: InputMaybe<Scalars['ID']['input']>;
  month?: InputMaybe<Scalars['Int']['input']>;
  /** Busca por descrição */
  search?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<TransactionType>;
  year?: InputMaybe<Scalars['Int']['input']>;
};

export type TransactionListOutput = {
  __typename?: 'TransactionListOutput';
  items: Array<TransactionModel>;
  page: Scalars['Int']['output'];
  perPage: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export type TransactionModel = {
  __typename?: 'TransactionModel';
  amountCents: Scalars['Int']['output'];
  category?: Maybe<CategoryModel>;
  categoryId?: Maybe<Scalars['ID']['output']>;
  createdAt: Scalars['DateTimeISO']['output'];
  date: Scalars['DateTimeISO']['output'];
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  type: TransactionType;
  updatedAt: Scalars['DateTimeISO']['output'];
  user: UserModel;
  userId: Scalars['ID']['output'];
};

/** Tipo da transação: Receita (INCOME) ou Despesa (EXPENSE) */
export enum TransactionType {
  Expense = 'EXPENSE',
  Income = 'INCOME'
}

export type UpdateCategoryInput = {
  color?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  icon?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateTransactionInput = {
  amountCents?: InputMaybe<Scalars['Int']['input']>;
  categoryId?: InputMaybe<Scalars['ID']['input']>;
  date?: InputMaybe<Scalars['DateTimeISO']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  type?: InputMaybe<TransactionType>;
};

export type UserModel = {
  __typename?: 'UserModel';
  createdAt: Scalars['DateTimeISO']['output'];
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  updatedAt: Scalars['DateTimeISO']['output'];
};

export type LoginMutationVariables = Exact<{
  input: LoginInput;
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'AuthOutput', token: string, refreshToken: string, user: { __typename?: 'UserModel', id: string, name: string, email: string, createdAt: any, updatedAt: any } } };

export type RegisterMutationVariables = Exact<{
  input: RegisterInput;
}>;


export type RegisterMutation = { __typename?: 'Mutation', register: { __typename?: 'AuthOutput', token: string, refreshToken: string, user: { __typename?: 'UserModel', id: string, name: string, email: string, createdAt: any, updatedAt: any } } };

export type CategoriesQueryVariables = Exact<{ [key: string]: never; }>;


export type CategoriesQuery = { __typename?: 'Query', categories: { __typename?: 'CategoryListOutput', items: Array<{ __typename?: 'CategoryModel', id: string, title: string, icon: string, color: string, description?: string | null, transactionCount?: number | null }> } };

export type CreateCategoryMutationVariables = Exact<{
  input: CreateCategoryInput;
}>;


export type CreateCategoryMutation = { __typename?: 'Mutation', createCategory: { __typename?: 'CategoryModel', id: string, title: string, icon: string, color: string, description?: string | null, transactionCount?: number | null } };

export type UpdateCategoryMutationVariables = Exact<{
  input: UpdateCategoryInput;
}>;


export type UpdateCategoryMutation = { __typename?: 'Mutation', updateCategory: { __typename?: 'CategoryModel', id: string, title: string, icon: string, color: string, description?: string | null, transactionCount?: number | null } };

export type DeleteCategoryMutationVariables = Exact<{
  input: DeleteByIdInput;
}>;


export type DeleteCategoryMutation = { __typename?: 'Mutation', deleteCategory: boolean };

export type DashboardSummaryQueryVariables = Exact<{
  month: Scalars['Int']['input'];
  year: Scalars['Int']['input'];
}>;


export type DashboardSummaryQuery = { __typename?: 'Query', dashboardSummary: { __typename?: 'DashboardSummaryOutput', balanceCents: number, incomeMonthCents: number, expenseMonthCents: number } };

export type TransactionsQueryVariables = Exact<{
  filters?: InputMaybe<TransactionFiltersInput>;
  pagination?: InputMaybe<PaginationInput>;
}>;


export type TransactionsQuery = { __typename?: 'Query', transactions: { __typename?: 'TransactionListOutput', total: number, page: number, perPage: number, items: Array<{ __typename?: 'TransactionModel', id: string, type: TransactionType, description: string, amountCents: number, date: any, categoryId?: string | null, userId: string, createdAt: any, updatedAt: any }> } };

export type CreateTransactionMutationVariables = Exact<{
  input: CreateTransactionInput;
}>;


export type CreateTransactionMutation = { __typename?: 'Mutation', createTransaction: { __typename?: 'TransactionModel', id: string, type: TransactionType, description: string, amountCents: number, date: any, categoryId?: string | null, userId: string, createdAt: any, updatedAt: any } };

export type UpdateTransactionMutationVariables = Exact<{
  input: UpdateTransactionInput;
}>;


export type UpdateTransactionMutation = { __typename?: 'Mutation', updateTransaction: { __typename?: 'TransactionModel', id: string, type: TransactionType, description: string, amountCents: number, date: any, categoryId?: string | null, userId: string, createdAt: any, updatedAt: any } };

export type DeleteTransactionMutationVariables = Exact<{
  input: DeleteByIdInput;
}>;


export type DeleteTransactionMutation = { __typename?: 'Mutation', deleteTransaction: boolean };

export class TypedDocumentString<TResult, TVariables>
  extends String
  implements DocumentTypeDecoration<TResult, TVariables>
{
  __apiType?: NonNullable<DocumentTypeDecoration<TResult, TVariables>['__apiType']>;
  private value: string;
  public __meta__?: Record<string, any> | undefined;

  constructor(value: string, __meta__?: Record<string, any> | undefined) {
    super(value);
    this.value = value;
    this.__meta__ = __meta__;
  }

  override toString(): string & DocumentTypeDecoration<TResult, TVariables> {
    return this.value;
  }
}

export const LoginDocument = new TypedDocumentString(`
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
    `) as unknown as TypedDocumentString<LoginMutation, LoginMutationVariables>;
export const RegisterDocument = new TypedDocumentString(`
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
    `) as unknown as TypedDocumentString<RegisterMutation, RegisterMutationVariables>;
export const CategoriesDocument = new TypedDocumentString(`
    query Categories {
  categories {
    items {
      id
      title
      icon
      color
      description
      transactionCount
    }
  }
}
    `) as unknown as TypedDocumentString<CategoriesQuery, CategoriesQueryVariables>;
export const CreateCategoryDocument = new TypedDocumentString(`
    mutation CreateCategory($input: CreateCategoryInput!) {
  createCategory(input: $input) {
    id
    title
    icon
    color
    description
    transactionCount
  }
}
    `) as unknown as TypedDocumentString<CreateCategoryMutation, CreateCategoryMutationVariables>;
export const UpdateCategoryDocument = new TypedDocumentString(`
    mutation UpdateCategory($input: UpdateCategoryInput!) {
  updateCategory(input: $input) {
    id
    title
    icon
    color
    description
    transactionCount
  }
}
    `) as unknown as TypedDocumentString<UpdateCategoryMutation, UpdateCategoryMutationVariables>;
export const DeleteCategoryDocument = new TypedDocumentString(`
    mutation DeleteCategory($input: DeleteByIdInput!) {
  deleteCategory(input: $input)
}
    `) as unknown as TypedDocumentString<DeleteCategoryMutation, DeleteCategoryMutationVariables>;
export const DashboardSummaryDocument = new TypedDocumentString(`
    query DashboardSummary($month: Int!, $year: Int!) {
  dashboardSummary(month: $month, year: $year) {
    balanceCents
    incomeMonthCents
    expenseMonthCents
  }
}
    `) as unknown as TypedDocumentString<DashboardSummaryQuery, DashboardSummaryQueryVariables>;
export const TransactionsDocument = new TypedDocumentString(`
    query Transactions($filters: TransactionFiltersInput, $pagination: PaginationInput) {
  transactions(filters: $filters, pagination: $pagination) {
    items {
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
    total
    page
    perPage
  }
}
    `) as unknown as TypedDocumentString<TransactionsQuery, TransactionsQueryVariables>;
export const CreateTransactionDocument = new TypedDocumentString(`
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
    `) as unknown as TypedDocumentString<CreateTransactionMutation, CreateTransactionMutationVariables>;
export const UpdateTransactionDocument = new TypedDocumentString(`
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
    `) as unknown as TypedDocumentString<UpdateTransactionMutation, UpdateTransactionMutationVariables>;
export const DeleteTransactionDocument = new TypedDocumentString(`
    mutation DeleteTransaction($input: DeleteByIdInput!) {
  deleteTransaction(input: $input)
}
    `) as unknown as TypedDocumentString<DeleteTransactionMutation, DeleteTransactionMutationVariables>;