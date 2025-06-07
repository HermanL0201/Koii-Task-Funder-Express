import winston from 'winston';
import path from 'path';

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

// Create a custom logger configuration
const logger = winston.createLogger({
  levels,
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  transports: [
    // Console logging
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize({ all: true }),
        winston.format.simple()
      )
    }),
    
    // File logging for errors
    new winston.transports.File({
      filename: path.join(process.cwd(), 'logs', 'error.log'),
      level: 'error',
      maxsize: 5 * 1024 * 1024, // 5MB max file size
      maxFiles: 5
    }),
    
    // File logging for combined logs
    new winston.transports.File({
      filename: path.join(process.cwd(), 'logs', 'combined.log'),
      maxsize: 5 * 1024 * 1024, // 5MB max file size
      maxFiles: 5
    })
  ]
});

// Logging utility methods
export const logError = (message: string, meta?: any) => {
  logger.error(message, meta);
};

export const logWarn = (message: string, meta?: any) => {
  logger.warn(message, meta);
};

export const logInfo = (message: string, meta?: any) => {
  logger.info(message, meta);
};

export const logDebug = (message: string, meta?: any) => {
  logger.debug(message, meta);
};

// Centralized error handler
export const handleError = (error: Error, context?: any) => {
  logger.error(`Unhandled Error: ${error.message}`, {
    stack: error.stack,
    context
  });
};

export default logger;