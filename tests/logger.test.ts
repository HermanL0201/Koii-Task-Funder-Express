import { describe, it, expect, vi } from 'vitest';
import winston from 'winston';
import logger, { requestLogger } from '../src/config/logger';

describe('Logger Configuration', () => {
  it('should create a logger with correct transports', () => {
    expect(logger).toBeTruthy();
    
    // Check transports
    const consoleTransport = logger.transports.find(
      transport => transport instanceof winston.transports.Console
    );
    const fileTransports = logger.transports.filter(
      transport => transport instanceof winston.transports.File
    );
    
    expect(consoleTransport).toBeTruthy();
    expect(fileTransports.length).toBe(2);
  });

  it('should have default log level', () => {
    expect(logger.level).toBe('info');
  });

  it('request logger middleware should call next', () => {
    const mockReq = {
      method: 'GET',
      path: '/test',
      ip: '127.0.0.1',
      headers: { 'user-agent': 'TestAgent' }
    };
    const mockRes = {
      on: vi.fn(),
      statusCode: 200
    };
    const mockNext = vi.fn();

    requestLogger(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalled();
  });
});