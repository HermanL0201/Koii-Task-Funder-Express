import express from 'express';
import request from 'supertest';
import crypto from 'crypto';

// Mock the required modules
jest.mock('@_koii/create-task-cli', () => ({
  FundTask: jest.fn(),
  KPLEstablishConnection: jest.fn(),
  KPLFundTask: jest.fn(),
  getTaskStateInfo: jest.fn(() => ({
    stake_pot_account: 'mockStakePotAccount',
    token_type: null
  })),
  KPLCheckProgram: jest.fn(),
  establishConnection: jest.fn(),
  checkProgram: jest.fn()
}));

jest.mock('@_koii/web3.js', () => ({
  PublicKey: jest.fn(),
  Connection: jest.fn(),
  Keypair: {
    fromSecretKey: jest.fn(() => ({}))
  }
}));

jest.mock('axios', () => ({
  post: jest.fn(() => Promise.resolve())
}));

// Import the actual app
import app from './index.js';

describe('Task Funding Express App', () => {
  let server;

  beforeAll(() => {
    // Set up environment variables for testing
    process.env.SIGNING_SECRET = 'test_secret';
    process.env.funder_keypair = JSON.stringify([1, 2, 3, 4]);
  });

  beforeEach(() => {
    server = app.listen(0);
  });

  afterEach(() => {
    server.close();
  });

  describe('Slack Request Verification', () => {
    it('should reject requests with invalid signatures', async () => {
      const timestamp = Math.floor(Date.now() / 1000).toString();
      const body = 'text=fund+task123+10';

      const response = await request(server)
        .post('/fundtask')
        .set('X-Slack-Signature', 'invalid_signature')
        .set('X-Slack-Request-Timestamp', timestamp)
        .send(body);

      expect(response.status).toBe(400);
      expect(response.text).toBe('Invalid request signature');
    });

    it('should reject requests with old timestamps', async () => {
      const timestamp = (Math.floor(Date.now() / 1000) - (60 * 6)).toString();
      const body = 'text=fund+task123+10';

      const sigBasestring = `v0:${timestamp}:${body}`;
      const hmac = crypto.createHmac('sha256', 'test_secret');
      const signature = 'v0=' + hmac.update(sigBasestring).digest('hex');

      const response = await request(server)
        .post('/fundtask')
        .set('X-Slack-Signature', signature)
        .set('X-Slack-Request-Timestamp', timestamp)
        .send(body);

      expect(response.status).toBe(400);
      expect(response.text).toBe('Invalid request signature');
    });
  });

  describe('User Authorization', () => {
    it('should reject unauthorized users', async () => {
      const timestamp = Math.floor(Date.now() / 1000).toString();
      const body = 'text=fund+task123+10&user_id=UNAUTHORIZED_USER';

      const sigBasestring = `v0:${timestamp}:${body}`;
      const hmac = crypto.createHmac('sha256', 'test_secret');
      const signature = 'v0=' + hmac.update(sigBasestring).digest('hex');

      const response = await request(server)
        .post('/fundtask')
        .set('X-Slack-Signature', signature)
        .set('X-Slack-Request-Timestamp', timestamp)
        .send(body);

      expect(response.status).toBe(200);
      // Additional assertions can be added to check the response body
    });
  });
});