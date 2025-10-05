import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import cookieParser from 'cookie-parser';
import cors, { CorsOptions } from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { schema } from '~/graphql/schema.js';
import { ROUTES } from '~/shared/const/index.js';
import { formatGraphQLError } from '~/utils/errors/index.js';
import 'tsconfig-paths/register.js';

dotenv.config();

const { PORT, NODE_ENV, CLIENT_URL } = process.env;

async function startServer() {
  const app = express();
  const corsOptions: CorsOptions =
    NODE_ENV === 'production' ? { origin: CLIENT_URL, credentials: true } : { origin: true, credentials: true };

  // ---------------
  // Middleware
  // ---------------
  app.use(cors(corsOptions));
  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  // ---------------
  // GraphQL
  // ---------------
  const apolloServer = new ApolloServer({
    schema,
    formatError: formatGraphQLError,
  });
  await apolloServer.start();

  app.use(ROUTES.ROOT, expressMiddleware(apolloServer));
  // ---------------
  // Start server
  // ---------------
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`🚀 Apollo server running at http://localhost:${PORT}${ROUTES.ROOT}`);
  });
}

// eslint-disable-next-line no-console
startServer().catch(console.error);
