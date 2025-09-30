import cookieParser from 'cookie-parser';
import cors, { CorsOptions } from 'cors';
import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import { env } from '~/config/env.js';
import { ROUTES } from '~/shared/const/index.js';
import 'tsconfig-paths/register.js';

dotenv.config();

async function startServer() {
  const app = express();
  const corsOptions: CorsOptions =
    env.NODE_ENV === 'production' ? { origin: env.CLIENT_URL, credentials: true } : { origin: true, credentials: true };

  // ---------------
  // Middleware
  // ---------------
  app.use(cors(corsOptions));
  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  // ---------------
  // Routes
  // ---------------
  app.get(ROUTES.ROOT, (_req: Request, res: Response) => res.send('Hello from ESM!')); // TODO: Test route

  // ---------------
  // Start server
  // ---------------
  app.listen(env.PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`🚀 Server running at http://localhost:${env.PORT}${ROUTES.ROOT}`);
  });
}

// eslint-disable-next-line no-console
startServer().catch(console.error);
