import { Pool } from 'pg';

let pool;

if (process.env.NODE_ENV === 'production') {
  pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || '127.0.0.1',
    database: process.env.DB_NAME || 'hospital_management',
    password: process.env.DB_PASSWORD || '1234',
    port: process.env.DB_PORT || 5432,
  });
} else {
  // In development, use a global variable so the pool is not recreated on every reload
  if (!global.pool) {
    global.pool = new Pool({
      user: process.env.DB_USER || 'postgres',
      host: process.env.DB_HOST || '127.0.0.1',
      database: process.env.DB_NAME || 'hospital_management',
      password: process.env.DB_PASSWORD || '1234',
      port: process.env.DB_PORT || 5432,
      max: 20,
      idleTimeoutMillis: 60000,
      connectionTimeoutMillis: 20000,
    });
  }
  pool = global.pool;
}

export const query = (text, params) => pool.query(text, params);

export default {
  query,
  pool,
};
