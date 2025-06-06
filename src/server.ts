import express from 'express';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Create and configure Express server
 * @returns Configured Express application
 */
export function createServer() {
  const app = express();

  // Basic middleware
  app.use(express.json());

  return app;
}

/**
 * Start the server
 * @param app Express application
 */
export function startServer(app: express.Application) {
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  const HOST = process.env.HOST || 'localhost';

  const server = app.listen(PORT, HOST, () => {
    console.log(`Server running at http://${HOST}:${PORT}`);
  });

  return server;
}

// If this file is run directly, start the server
if (require.main === module) {
  const app = createServer();
  startServer(app);
}