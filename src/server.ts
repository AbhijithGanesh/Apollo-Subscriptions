import { createServer } from "http";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import { WebSocketServer } from "ws";
import { ApolloServer } from "apollo-server-express";
import express from "express";
import { useServer } from "graphql-ws/lib/use/ws";
import { schema } from "./graphql/schema";
import { context } from "./graphql/context";

const PORT = process.env.PORT || 4000;

const app = express();
const httpServer = createServer(app);

async function start() {
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/graphql",
  });

  const serverCleanup = useServer(
    {
      schema,
      context,
    },
    wsServer
  );

  const server = new ApolloServer({
    schema,
    context,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });

  await server.start();
  server.applyMiddleware({ app });

  httpServer.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
    console.log(`⏰ Subscriptions ready at http://localhost:${PORT}/graphql`);
  });
}

start();
