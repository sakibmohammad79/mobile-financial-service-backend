import dotenv from 'dotenv';
import path from 'path';
import { cwd } from 'process';

dotenv.config({ path: path.join(cwd(), '.env') });

export default {
  PORT: process.env.PORT,
  DATABASE_URL: process.env.DATABASE_URL,
  jwt: {
    access_token_secret: process.env.ACCESS_TOKEN_SECRET,
    access_token_expires_in: process.env.ACCESS_TOKEN_EXPIRES_IN,
  },
};
