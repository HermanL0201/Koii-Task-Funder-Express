import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as loggerModule from './logger';
import winston from 'winston';

describe('Logger Utility', () => {
  // Mock logger methods
  let mockLogger: any;

  beforeEach(() => {
    mockLogger = {
      log: vi.fn(),
      error: vi.fn()
    };

    // Mock the entire Winston logger creation
    vi.spyOn(winston, 'createLogger').mockReturnValue(mockLogger);
  });

  it('should log errors correctly', () => {
    const errorMessage = 'Test error';
    const errorMeta = { code: 500 };
    
    loggerModule.logError(errorMessage, errorMeta);
    
    expect(mockLogger.log).toHaveBeenCalledWith('error', errorMessage, errorMeta);
  });

  it('should log warnings correctly', () => {
    const warningMessage = 'Test warning';
    const warningMeta = { warning: 'Potential issue' };
    
    loggerModule.logWarn(warningMessage, warningMeta);
    
    expect(mockLogger.log).toHaveBeenCalledWith('warn', warningMessage, warningMeta);
  });

  it('should log info messages', () => {
    const infoMessage = 'Information log';
    const infoMeta = { user: 'admin' };
    
    loggerModule.logInfo(infoMessage, infoMeta);
    
    expect(mockLogger.log).toHaveBeenCalledWith('info', infoMessage, infoMeta);
  });

  it('should log debug messages', () => {
    const debugMessage = 'Debug log';
    const debugMeta = { details: 'Extra info' };
    
    loggerModule.logDebug(debugMessage, debugMeta);
    
    expect(mockLogger.log).toHaveBeenCalledWith('debug', debugMessage, debugMeta);
  });

  it('should handle errors with context', () => {
    const testError = new Error('Test Error');
    const context = { operation: 'test' };
    
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    loggerModule.handleError(testError, context);
    
    expect(mockLogger.error).toHaveBeenCalledWith('Unhandled Error', expect.objectContaining({
      message: 'Test Error',
      context: { operation: 'test' }
    }));
    expect(consoleSpy).toHaveBeenCalledWith('Unhandled Error:', 'Test Error', context);
    
    consoleSpy.mockRestore();
  });
});