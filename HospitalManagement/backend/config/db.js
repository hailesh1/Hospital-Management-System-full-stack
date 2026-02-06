const { Pool } = require('pg');
const { promisify } = require('util');
const logger = require('../utils/logger');

// Database configuration
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'hospital_management',
  password: process.env.DB_PASSWORD || 'yourpassword',
  port: parseInt(process.env.DB_PORT || '5432'),
  max: 20, // max number of clients in the pool
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
  connectionTimeoutMillis: 2000, // how long to wait when connecting a new client
});

// Promisify for async/await
const query = promisify(pool.query).bind(pool);

// Test the database connection
const connectDB = async () => {
  try {
    const client = await pool.connect();
    logger.info('PostgreSQL Connected...');
    client.release();
    return true;
  } catch (err) {
    logger.error(`Database connection error: ${err.message}`);
    // Exit process with failure
    process.exit(1);
  }
};

// Handle database errors
pool.on('error', (err) => {
  logger.error(`Unexpected error on idle client: ${err.message}`);
  process.exit(-1);
});

// Handle process termination
process.on('SIGINT', () => {
  pool.end(() => {
    logger.info('Pool has ended');
    process.exit(0);
  });
});

module.exports = {
  query,
  connectDB,
  pool,
};
