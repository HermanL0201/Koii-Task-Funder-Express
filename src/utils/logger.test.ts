import { describe, it, expect, vi, afterEach } from 'vitest';
import { logError, logWarn, logInfo, logDebug, handleError } from './logger';
import winston from 'winston';

describe('Logger Utility', () => {
  // Mock logger methods
  const mockLogger = {
    log: vi.fn(),
    error: vi.fn()
  };

  // Replace the winston.createLogger with our mock
  vi.spyOn(winston, 'createLogger').mockReturnValue(mockLogger as any);

  const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

  afterEach(() => {
    mockLogger.log.mockClear();
    mockLogger.error.mockClear();
    consoleSpy.mockClear();
  });

  it('should log errors correctly', () => {
    const errorMessage = 'Test error';
    const errorMeta = { code: 500 };
    
    logError(errorMessage, errorMeta);
    
    expect(mockLogger.log).toHaveBeenCalledWith('error', errorMessage, errorMeta);
  });

  it('should log warnings correctly', () => {
    const warningMessage = 'Test warning';
    const warningMeta = { warning: 'Potential issue' };
    
    logWarn(warningMessage, warningMeta);
    
    expect(mockLogger.log).toHaveBeenCalledWith('warn', warningMessage, warningMeta);
  });

  it('should log info messages', () => {
    const infoMessage = 'Information log';
    const infoMeta = { user: 'admin' };
    
    logInfo(infoMessage, infoMeta);
    
    expect(mockLogger.log).toHaveBeenCalledWith('info', infoMessage, infoMeta);
  });

  it('should log debug messages', () => {
    const debugMessage = 'Debug log';
    const debugMeta = { details: 'Extra info' };
    
    logDebug(debugMessage, debugMeta);
    
    expect(mockLogger.log).toHaveBeenCalledWith('debug', debugMessage, debugMeta);
  });

  it('should handle errors with context', () => {
    const testError = new Error('Test Error');
    const context = { operation: 'test' };
    
    handleError(testError, context);
    
    expect(mockLogger.error).toHaveBeenCalledWith('Unhandled Error', expect.objectContaining({
      message: 'Test Error',
      context: { operation: 'test' }
    }));
    expect(consoleSpy).toHaveBeenCalledWith('Unhandled Error:', 'Test Error', context);
  });
});