import express, { Express, Request, Response, NextFunction } from 'express';

// Create Express app
export const createServer = (): Express => {
  const app = express();

  // Basic middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Logging middleware
  app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  });

  // Basic health check route
  app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'OK', message: 'Hero API is running' });
  });

  // Global error handler
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ 
      status: 'error', 
      message: 'Something went wrong!' 
    });
  });

  return app;
};

// Server startup function
export const startServer = (app: Express, port: number = 3000) => {
  return app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
};