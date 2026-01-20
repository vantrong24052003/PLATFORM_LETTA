import { Sequelize } from '@sequelize/core';
import { PostgresDialect } from '@sequelize/postgres';
import { envConfig } from './env.config.js';
import { LogLevel } from '@/constants/log.constants.js';

const sequelize = new Sequelize({
  dialect: PostgresDialect,
  database: envConfig.LETTA_DB_NAME,
  user: envConfig.LETTA_DB_USER,
  password: envConfig.LETTA_DB_PASSWORD,
  host: envConfig.LETTA_DB_HOST,
  port: envConfig.LETTA_DB_PORT,
  clientMinMessages: LogLevel.WARNING,
  models: [],
});

export default sequelize;
