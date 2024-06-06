require('dotenv').config()
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./graphql/schemas');
const resolvers = require('./graphql/resolvers');
const verifyToken = require('./helpers/verifyToken');
const cors = require('cors');

async function startApolloServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      let user = null;
      const token = req.headers.authorization?.split(' ')[1] || null;
      if (token && typeof token === "string") {
        user = verifyToken(token);
      }
      return { user };
    }
  });

  await server.start();

  const app = express();
  app.use(cors());
  app.options(process.env.FRONTEND_URL, cors());

  server.applyMiddleware({ app, path: '/graphql' });

  const port = process.env.PORT || 4000;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log(`GraphQL endpoint: http://localhost:${port}/graphql`);
  });
}

startApolloServer();
