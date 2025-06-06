import { describe, it, expect } from 'vitest';
import express from 'express';

describe('Express Application', () => {
  it('should create an Express app', () => {
    const app = express();
    expect(app).toBeTruthy();
  });
});