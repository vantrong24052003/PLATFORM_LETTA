import { Pool } from 'pg';
import { envConfig } from './env.config.js';

const pool = new Pool({
  host: envConfig.LETTA_DB_HOST,
  port: envConfig.LETTA_DB_PORT,
  user: envConfig.LETTA_DB_USER,
  password: envConfig.LETTA_DB_PASSWORD,
  database: envConfig.LETTA_DB_NAME,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

export default pool;
