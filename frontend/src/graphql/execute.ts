import type { TypedDocumentString } from "@/graphql/graphql";

type Variables<T> = T extends Record<string, never> ? [] : [T];

async function postGraphQL(body: unknown, withAuth: boolean) {
  const token = localStorage.getItem("token");

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/graphql-response+json",
  };

  if (withAuth && token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(import.meta.env.VITE_GRAPHQL_URL, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  const json = await res.json();

  // padrão graphql: errors vem no payload mesmo com 200
  if (!res.ok || json?.errors?.length) {
    const message =
      json?.errors?.[0]?.message ?? `Request failed (${res.status})`;
    throw new Error(message);
  }

  return json.data;
}

export async function executePublic<TResult, TVariables>(
  query: TypedDocumentString<TResult, TVariables>,
  ...[variables]: Variables<TVariables>
): Promise<TResult> {
  return postGraphQL({ query, variables }, false);
}

export async function executeAuth<TResult, TVariables>(
  query: TypedDocumentString<TResult, TVariables>,
  ...[variables]: Variables<TVariables>
): Promise<TResult> {
  return postGraphQL({ query, variables }, true);
}