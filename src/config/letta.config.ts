import dotenv from 'dotenv';

dotenv.config();

export interface LettaConfig {
  port: number | string;
  letta: {
    apiKey: string;
  };
}

export const config: LettaConfig = {
  port: process.env.PORT || 3000,
  letta: {
    apiKey: process.env.LETTA_API_KEY || '',
  },
};
