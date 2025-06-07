import { describe, it, expect, vi } from 'vitest';
import { logError, logWarn, logInfo, logDebug, handleError } from './logger';
import winston from 'winston';

describe('Logger Utility', () => {
  const mockLogger = {
    error: vi.fn(),
    warn: vi.fn(),
    info: vi.fn(),
    debug: vi.fn()
  };

  // Mock Winston logger
  vi.spyOn(winston, 'createLogger').mockReturnValue(mockLogger as any);

  it('should log errors correctly', () => {
    const errorMessage = 'Test error';
    const errorMeta = { code: 500 };
    
    logError(errorMessage, errorMeta);
    
    expect(mockLogger.error).toHaveBeenCalledWith(errorMessage, errorMeta);
  });

  it('should log warnings correctly', () => {
    const warningMessage = 'Test warning';
    const warningMeta = { warning: 'Potential issue' };
    
    logWarn(warningMessage, warningMeta);
    
    expect(mockLogger.warn).toHaveBeenCalledWith(warningMessage, warningMeta);
  });

  it('should log info messages', () => {
    const infoMessage = 'Information log';
    const infoMeta = { user: 'admin' };
    
    logInfo(infoMessage, infoMeta);
    
    expect(mockLogger.info).toHaveBeenCalledWith(infoMessage, infoMeta);
  });

  it('should log debug messages', () => {
    const debugMessage = 'Debug log';
    const debugMeta = { details: 'Extra info' };
    
    logDebug(debugMessage, debugMeta);
    
    expect(mockLogger.debug).toHaveBeenCalledWith(debugMessage, debugMeta);
  });

  it('should handle errors with context', () => {
    const testError = new Error('Test Error');
    const context = { operation: 'test' };
    
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    handleError(testError, context);
    
    expect(consoleErrorSpy).toHaveBeenCalled();
    
    consoleErrorSpy.mockRestore();
  });
});