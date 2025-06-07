import express, { Application, Request, Response, NextFunction } from 'express';

class Server {
  private app: Application;
  private port: number;

  constructor(port: number = 3000) {
    this.app = express();
    this.port = port;
    this.initializeMiddleware();
  }

  private initializeMiddleware(): void {
    // Parse JSON bodies
    this.app.use(express.json());
    
    // Parse URL-encoded bodies
    this.app.use(express.urlencoded({ extended: true }));

    // Basic error handling middleware
    this.app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
      console.error(err.stack);
      res.status(500).json({
        status: 'error',
        message: 'Something went wrong!'
      });
    });
  }

  public start(): void {
    this.app.listen(this.port, () => {
      console.log(`Server is running on port ${this.port}`);
    });
  }

  public getApp(): Application {
    return this.app;
  }
}

export default Server;