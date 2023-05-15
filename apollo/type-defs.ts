import { gql } from "@apollo/client";

export const typeDefs = gql`
  type Post {
    id: Int!
    title: String!
  }

  type Query {
    viewer: User
  }

  type Mutations {
    createPost: Post!
  }

  type Subscription {
    recieveUpdates: Post!
  }
`;
