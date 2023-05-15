import { Post } from "@prisma/client";
import { prisma } from "../prisma/client";
import { PubSub } from "graphql-subscriptions";

const pubSub = new PubSub();

export const resolvers = {
  Query: {
    async viewer() {
      let body: Promise<Post[]> = prisma.post.findMany();
      await body;
      return body;
    },
  },
  Mutation: {
    async createPost(parent, args, ctxt, info) {
      const { title } = args;
      let body: Promise<Post> = prisma.post.create({
        data: {
          title: title,
        },
      });
      await body;
      pubSub.publish("newPost", { body });
      return body;
    },
  },
  Subscription: {
    recieveUpdates: {
      resolve: (payload) => payload.newPost,
      subscribe: () => pubSub.asyncIterator("newPost"),
    },
  },
};
