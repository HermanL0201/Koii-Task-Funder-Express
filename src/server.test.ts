import { describe, it, expect } from 'vitest';
import Server from './server';

describe('Server Configuration', () => {
  it('should create a server instance', () => {
    const server = new Server();
    expect(server).toBeTruthy();
  });

  it('should have an Express application', () => {
    const server = new Server();
    const app = server.getApp();
    expect(app).toBeTruthy();
  });
});