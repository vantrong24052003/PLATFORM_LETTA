import dotenv from 'dotenv';

dotenv.config();

export interface LettaConfig {
  port: number | string;
  letta: {
    baseUrl: string;
    apiKey?: string;
    openaiApiBase?: string;
  };
}

export const config: LettaConfig = {
  port: process.env.PORT || 3000,
  letta: {
    baseUrl: 'http://localhost:8283',
    apiKey: process.env.LETTA_SERVER_PASSWORD,
    openaiApiBase: process.env.OPENAI_API_BASE,
  },
};
