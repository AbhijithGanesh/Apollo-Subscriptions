import { Post } from "@prisma/client";
import { prisma } from "../prisma/client";
import { PubSub } from "graphql-subscriptions";

const pubSub = new PubSub();

export const resolvers = {
  Query: {
    viewer() {
      return { id: 1, name: "John Smith", status: "cached" };
    },
  },
  Mutation: {
    createPost(parent, args, ctxt, info) {
      const { title, id } = args;
      let body: Promise<Post> = prisma.post.create({
        data: {
          title: title,
          id: id,
        },
      });
      pubSub.publish("newPost", { body });
    },
  },
  Subscription: {
    recieveUpdates: {
      resolve: (payload) => payload.newPost,
      subscribe: () => pubSub.asyncIterator("newPost"),
    },
  },
};
