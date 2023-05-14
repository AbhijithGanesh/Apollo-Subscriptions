import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
} from "@apollo/client";
import { SchemaLink } from "@apollo/client/link/schema";
import merge from "deepmerge";
import { useMemo } from "react";
import { schema } from "./schema";

let apolloClient: ApolloClient<InMemoryCache>;

function createIsomorphLink() {
  if (typeof window === "undefined") {
    return new SchemaLink({ schema });
  } else {
    return new HttpLink({
      uri: "/api/graphql",
      credentials: "same-origin",
    });
  }
}

function createApolloClient() {
  return new ApolloClient({
    ssrMode: typeof window === "undefined",
    link: createIsomorphLink(),
    cache: new InMemoryCache(),
  });
}

export function initializeApollo(initialState = null) {
  const _apolloClient = apolloClient ?? createApolloClient();

  // If your page has Next.js data fetching methods that use Apollo Client, the initial state
  // gets hydrated here
  if (initialState) {
    // Get existing cache, loaded during client side data fetching
    const existingCache: InMemoryCache | NormalizedCacheObject =
      _apolloClient.extract();

    // Merge the existing cache into data passed from getStaticProps/getServerSideProps
    // @ts-expect-error
    const data = merge(initialState, existingCache);

    // Restore the cache with the merged data
    // @ts-expect-error
    _apolloClient.cache.restore(data);
  }
  // For SSG and SSR always create a new Apollo Client
  if (typeof window === "undefined") return _apolloClient;
  // Create the Apollo Client once in the client
  // @ts-expect-error
  if (!apolloClient) apolloClient = _apolloClient;

  return _apolloClient;
}

export function useApollo(initialState) {
  const store = useMemo(() => initializeApollo(initialState), [initialState]);
  return store;
}
