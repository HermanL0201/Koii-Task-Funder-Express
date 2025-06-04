const { expect } = require('chai');
const request = require('supertest');
const express = require('express');
const validateCoinListQuery = require('../src/middleware/coinListValidation');

describe('Coin List Validation Middleware', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.get('/coins', validateCoinListQuery, (req, res) => {
      res.status(200).json({ success: true });
    });
  });

  // Valid query tests
  it('should pass with valid query parameters', async () => {
    const response = await request(app)
      .get('/coins?page=1&per_page=10&order=market_cap_desc&sparkline=true');
    
    expect(response.status).to.equal(200);
    expect(response.body.success).to.be.true;
  });

  // Invalid query tests
  it('should fail with invalid page parameter', async () => {
    const response = await request(app)
      .get('/coins?page=-1');
    
    expect(response.status).to.equal(400);
    expect(response.body.error).to.equal('Invalid query parameters');
    expect(response.body.details).to.be.an('array');
  });

  it('should fail with invalid per_page parameter', async () => {
    const response = await request(app)
      .get('/coins?per_page=300');
    
    expect(response.status).to.equal(400);
    expect(response.body.error).to.equal('Invalid query parameters');
    expect(response.body.details).to.be.an('array');
  });

  it('should fail with invalid order parameter', async () => {
    const response = await request(app)
      .get('/coins?order=invalid_order');
    
    expect(response.status).to.equal(400);
    expect(response.body.error).to.equal('Invalid query parameters');
    expect(response.body.details).to.be.an('array');
  });
});