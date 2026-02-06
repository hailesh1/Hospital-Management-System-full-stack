const app = require('./app');
const { connectDB } = require('./config/db');

// Load environment variables
require('dotenv').config();

const PORT = process.env.PORT || 5000;

// Connect to database
connectDB()
  .then(() => {
    console.log('Database connected successfully');
    
    // Start the server
    const server = app.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err) => {
      console.error(`Error: ${err.message}`);
      // Close server & exit process
      server.close(() => process.exit(1));
    });
  })
  .catch((err) => {
    console.error('Failed to connect to database', err);
    process.exit(1);
  });

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error(`Error: ${err.message}`);
  process.exit(1);
});
