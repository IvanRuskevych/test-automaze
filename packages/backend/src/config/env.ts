import dotenv from 'dotenv';
import { z } from 'zod';
import { REGEX } from '~/shared/const/index.js';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  PORT: z.string().regex(REGEX.PORT).transform(Number).default(5000),
  CLIENT_URL: z.string().refine(
    (val) => {
      try {
        new URL(val);
        return true;
      } catch {
        return false;
      }
    },
    { message: 'CLIENT_URL must be a valid URL' },
  ),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  // eslint-disable-next-line no-console
  console.error('❌ Invalid environment configuration:');

  // eslint-disable-next-line no-console
  console.dir(z.treeifyError(parsedEnv.error), { depth: null });

  process.exit(1);
}

export const env = parsedEnv.data;
