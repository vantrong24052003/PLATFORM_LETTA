import { envConfig } from './env.config.js';

export interface LettaConfig {
  port: number | string;
  letta: {
    baseUrl: string;
    apiKey: string;
    openaiApiBase: string;
  };
}

export const config: LettaConfig = {
  port: envConfig.PORT,
  letta: {
    baseUrl: envConfig.LETTA_BASE_URL,
    apiKey: envConfig.LETTA_SERVER_PASSWORD,
    openaiApiBase: envConfig.OPENAI_API_BASE,
  },
};
