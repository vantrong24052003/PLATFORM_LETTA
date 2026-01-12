import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

function validateEnv() {
  const exampleEnvPath = path.join(process.cwd(), '.env.example');

  if (!fs.existsSync(exampleEnvPath)) {
    return;
  }

  const exampleContent = fs.readFileSync(exampleEnvPath, 'utf-8');
  const requiredKeys = exampleContent
    .split('\n')
    .filter(line => line.trim() && !line.startsWith('#'))
    .map(line => line.split('=')[0].trim())
    .filter(key => key);

  const missingKeys = requiredKeys.filter(key => {
    const value = process.env[key];
    return value === undefined || value === '';
  });

  if (missingKeys.length > 0) {
    throw new Error(
      `Missing or empty required environment variables:\n` +
      `${missingKeys.map(key => `  - ${key}`).join('\n')}\n\n` +
      `Please check your .env file against .env.example`
    );
  }
}

validateEnv();

export const envConfig = {
  PORT: process.env.PORT!,
  LETTA_PORT: process.env.LETTA_PORT!,
  ZHIPUAI_API_KEY: process.env.ZHIPUAI_API_KEY!,
  LETTA_BASE_URL: process.env.LETTA_BASE_URL!,
  LETTA_SERVER_PASSWORD: process.env.LETTA_SERVER_PASSWORD!,
  OPENAI_API_BASE: process.env.OPENAI_API_BASE!,
  LETTA_DB_HOST: process.env.LETTA_DB_HOST!,
  LETTA_DB_PORT: parseInt(process.env.LETTA_DB_PORT!),
  LETTA_DB_USER: process.env.LETTA_DB_USER!,
  LETTA_DB_PASSWORD: process.env.LETTA_DB_PASSWORD!,
  LETTA_DB_NAME: process.env.LETTA_DB_NAME!,
  NODE_ENV: process.env.NODE_ENV,
};
