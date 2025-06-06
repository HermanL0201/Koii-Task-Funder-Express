import express, { Application, Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import winston from 'winston';

// Configure Winston logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

class SephoraApp {
  public app: Application;

  constructor() {
    this.app = express();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares() {
    // Security middlewares
    this.app.use(helmet());
    this.app.use(cors());
    
    // Parsing middlewares
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private initializeRoutes() {
    // Add placeholders for routes - will be expanded later
    this.app.get('/', (req: Request, res: Response) => {
      res.json({ message: 'Sephora API is running' });
    });
  }

  private initializeErrorHandling() {
    // Global error handler
    this.app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
      logger.error(`Unhandled error: ${err.message}`, { 
        error: err,
        stack: err.stack 
      });

      res.status(500).json({
        status: 'error',
        message: 'Internal Server Error'
      });
    });

    // 404 handler
    this.app.use((req: Request, res: Response) => {
      logger.warn(`Route not found: ${req.method} ${req.path}`);
      res.status(404).json({
        status: 'error',
        message: 'Route Not Found'
      });
    });
  }

  public listen(port: number) {
    this.app.listen(port, () => {
      logger.info(`Server running on port ${port}`);
    });
  }
}

export default new SephoraApp().app;