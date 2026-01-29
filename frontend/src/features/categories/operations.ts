import { graphql } from "@/graphql/gql";

export const CategoriesQuery = graphql(`
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
`);

export const CreateCategoryMutation = graphql(`
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
`);

export const UpdateCategoryMutation = graphql(`
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
`);

export const DeleteCategoryMutation = graphql(`
  mutation DeleteCategory($input: DeleteByIdInput!) {
    deleteCategory(input: $input)
  }
`);
