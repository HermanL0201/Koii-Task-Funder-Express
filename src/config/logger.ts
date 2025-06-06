import winston from 'winston';
import path from 'path';

// Create logs directory if it doesn't exist
const logDir = path.join(process.cwd(), 'logs');

// Configure Winston logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  defaultMeta: { service: 'sephora-api' },
  transports: [
    // Console transport for development
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    // File transport for error logs
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error'
    }),
    // File transport for combined logs
    new winston.transports.File({
      filename: path.join(logDir, 'combined.log')
    })
  ]
});

// Middleware for request logging
export const requestLogger = (req, res, next) => {
  const { method, path, ip, headers } = req;
  const userAgent = headers['user-agent'] || 'Unknown';

  logger.info({
    message: 'API Request',
    method,
    path,
    ip,
    userAgent
  });

  // Track response time
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info({
      message: 'API Response',
      method,
      path,
      statusCode: res.statusCode,
      duration: `${duration}ms`
    });
  });

  next();
};

export default logger;