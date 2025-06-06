import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createServer, startServer } from '../src/server';
import http from 'http';

describe('Server Configuration', () => {
  let server: http.Server;

  beforeEach(() => {
    // Reset environment variables before each test
    delete process.env.PORT;
    delete process.env.HOST;
  });

  afterEach(() => {
    if (server) {
      server.close();
    }
  });

  it('should create a server with default configuration', () => {
    const app = createServer();
    expect(app).toBeTruthy();
  });

  it('should start server with default port and host', () => {
    const app = createServer();
    server = startServer(app);

    expect(server).toBeTruthy();
  });

  it('should use custom PORT from environment variable', () => {
    process.env.PORT = '5000';
    const app = createServer();
    
    // Mock server.listen to capture arguments
    const listenSpy = {
      host: '',
      port: 0,
      callback: () => {}
    };

    app.listen = (port: number, host: string, callback: () => void) => {
      listenSpy.host = host;
      listenSpy.port = port;
      listenSpy.callback = callback;
      return {} as http.Server;
    };

    startServer(app);

    expect(listenSpy.port).toBe(5000);
    expect(listenSpy.host).toBe('localhost');
  });

  it('should use custom HOST from environment variable', () => {
    process.env.HOST = '127.0.0.1';
    const app = createServer();
    
    // Mock server.listen to capture arguments
    const listenSpy = {
      host: '',
      port: 0,
      callback: () => {}
    };

    app.listen = (port: number, host: string, callback: () => void) => {
      listenSpy.host = host;
      listenSpy.port = port;
      listenSpy.callback = callback;
      return {} as http.Server;
    };

    startServer(app);

    expect(listenSpy.host).toBe('127.0.0.1');
  });
});