import { gql } from "@apollo/client";

export const typeDefs = gql`
  type Post {
    id: Int!
    title: String!
  }

  type Query {
    viewer: [Post]
  }

  type Mutation {
    createPost(title: String!): Post!
  }

  type Subscription {
    recieveUpdates: Post!
  }
`;
