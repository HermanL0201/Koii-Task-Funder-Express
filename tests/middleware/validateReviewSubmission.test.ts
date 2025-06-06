import { describe, it, expect } from 'vitest';
import { validateReviewSubmission } from '../../src/middleware/validateReviewSubmission';
import { Request, Response, NextFunction } from 'express';

describe('validateReviewSubmission middleware', () => {
  const mockNext: NextFunction = () => {};

  const createMockRequest = (body: any): Partial<Request> => ({
    body
  });

  const createMockResponse = () => {
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis()
    } as unknown as Response;
    return res;
  };

  it('should pass validation for valid review submission', () => {
    const req = createMockRequest({
      productId: 'product123',
      rating: 4,
      comment: 'Great product!',
      title: 'Awesome'
    });
    const res = createMockResponse();
    const nextMock = vi.fn();

    validateReviewSubmission(req as Request, res, nextMock);

    expect(nextMock).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('should reject submission with missing product ID', () => {
    const req = createMockRequest({
      rating: 4,
      comment: 'Great product!'
    });
    const res = createMockResponse();
    const nextMock = vi.fn();

    validateReviewSubmission(req as Request, res, nextMock);

    expect(nextMock).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      error: expect.stringContaining('Invalid product ID')
    }));
  });

  it('should reject submission with invalid rating', () => {
    const req = createMockRequest({
      productId: 'product123',
      rating: 6,
      comment: 'Great product!'
    });
    const res = createMockResponse();
    const nextMock = vi.fn();

    validateReviewSubmission(req as Request, res, nextMock);

    expect(nextMock).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      error: expect.stringContaining('Invalid rating')
    }));
  });

  it('should reject long comment', () => {
    const req = createMockRequest({
      productId: 'product123',
      rating: 4,
      comment: 'a'.repeat(501)
    });
    const res = createMockResponse();
    const nextMock = vi.fn();

    validateReviewSubmission(req as Request, res, nextMock);

    expect(nextMock).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      error: expect.stringContaining('Comment must be 500 characters or less')
    }));
  });

  it('should reject long title', () => {
    const req = createMockRequest({
      productId: 'product123',
      rating: 4,
      title: 'a'.repeat(101)
    });
    const res = createMockResponse();
    const nextMock = vi.fn();

    validateReviewSubmission(req as Request, res, nextMock);

    expect(nextMock).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      error: expect.stringContaining('Title must be 100 characters or less')
    }));
  });
});