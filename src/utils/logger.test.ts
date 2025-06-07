import { describe, it, expect, vi, afterEach } from 'vitest';
import { logError, logWarn, logInfo, logDebug, handleError } from './logger';
import winston from 'winston';

describe('Logger Utility', () => {
  // Spy on the Winston logger
  const errorSpy = vi.spyOn(winston.createLogger(), 'log');
  const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

  afterEach(() => {
    errorSpy.mockClear();
    consoleSpy.mockClear();
  });

  it('should log errors correctly', () => {
    const errorMessage = 'Test error';
    const errorMeta = { code: 500 };
    
    logError(errorMessage, errorMeta);
    
    expect(errorSpy).toHaveBeenCalledWith('error', errorMessage, errorMeta);
  });

  it('should log warnings correctly', () => {
    const warningMessage = 'Test warning';
    const warningMeta = { warning: 'Potential issue' };
    
    logWarn(warningMessage, warningMeta);
    
    expect(errorSpy).toHaveBeenCalledWith('warn', warningMessage, warningMeta);
  });

  it('should log info messages', () => {
    const infoMessage = 'Information log';
    const infoMeta = { user: 'admin' };
    
    logInfo(infoMessage, infoMeta);
    
    expect(errorSpy).toHaveBeenCalledWith('info', infoMessage, infoMeta);
  });

  it('should log debug messages', () => {
    const debugMessage = 'Debug log';
    const debugMeta = { details: 'Extra info' };
    
    logDebug(debugMessage, debugMeta);
    
    expect(errorSpy).toHaveBeenCalledWith('debug', debugMessage, debugMeta);
  });

  it('should handle errors with context', () => {
    const testError = new Error('Test Error');
    const context = { operation: 'test' };
    
    handleError(testError, context);
    
    expect(errorSpy).toHaveBeenCalledWith('error', 'Unhandled Error', expect.objectContaining({
      message: 'Test Error',
      context: { operation: 'test' }
    }));
    expect(consoleSpy).toHaveBeenCalledWith('Unhandled Error:', 'Test Error', context);
  });
});