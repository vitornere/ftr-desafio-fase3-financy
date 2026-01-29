import type { TypedDocumentString } from "@/graphql/graphql"
import { AppError, createAppErrorFromGraphQL } from "@/lib/errors"

type Variables<T> = T extends Record<string, never> ? [] : [T]

interface GraphQLResponse<T = unknown> {
  data?: T
  errors?: Array<{
    message: string
    extensions?: {
      code?: string
      [key: string]: unknown
    }
  }>
}

async function postGraphQL(body: unknown, withAuth: boolean) {
  const token = localStorage.getItem("token")

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/graphql-response+json",
  }

  if (withAuth && token) {
    headers.Authorization = `Bearer ${token}`
  }

  let res: Response
  try {
    res = await fetch(import.meta.env.VITE_GRAPHQL_URL, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    })
  } catch (networkError) {
    // Network error (offline, DNS failure, etc.)
    throw new AppError(
      "Erro de conexão. Verifique sua internet.",
      "NETWORK",
      networkError
    )
  }

  let json: GraphQLResponse
  try {
    json = await res.json()
  } catch {
    // Response is not valid JSON
    throw new AppError(
      `Resposta inválida do servidor (${res.status})`,
      "UNKNOWN"
    )
  }

  // GraphQL errors come in the payload even with 200 status
  if (json?.errors?.length) {
    throw createAppErrorFromGraphQL(json.errors)
  }

  // HTTP error without GraphQL errors
  if (!res.ok) {
    throw new AppError(`Erro do servidor (${res.status})`, "UNKNOWN")
  }

  return json.data
}

export async function executePublic<TResult, TVariables>(
  query: TypedDocumentString<TResult, TVariables>,
  ...[variables]: Variables<TVariables>
): Promise<TResult> {
  return postGraphQL({ query, variables }, false) as Promise<TResult>
}

export async function executeAuth<TResult, TVariables>(
  query: TypedDocumentString<TResult, TVariables>,
  ...[variables]: Variables<TVariables>
): Promise<TResult> {
  return postGraphQL({ query, variables }, true) as Promise<TResult>
}
