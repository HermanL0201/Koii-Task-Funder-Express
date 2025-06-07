import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

// Schema for hero name validation
const heroNameSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .pattern(/^[a-zA-Z\s-]+$/)
    .required()
    .messages({
      'string.empty': 'Hero name cannot be empty',
      'string.min': 'Hero name must be at least 2 characters long',
      'string.max': 'Hero name cannot exceed 50 characters',
      'string.pattern.base': 'Hero name can only contain letters, spaces, and hyphens'
    })
});

// Middleware for hero name validation
export const validateHeroName = (req: Request, res: Response, next: NextFunction) => {
  const { name } = req.params;

  // Validate hero name
  const { error } = heroNameSchema.validate({ name });

  if (error) {
    return res.status(400).json({
      error: 'Invalid hero name',
      details: error.details[0].message
    });
  }

  next();
};

// Schema for hero search query validation
const heroSearchSchema = Joi.object({
  q: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .pattern(/^[a-zA-Z\s-]+$/)
    .messages({
      'string.min': 'Search query must be at least 2 characters long',
      'string.max': 'Search query cannot exceed 50 characters',
      'string.pattern.base': 'Search query can only contain letters, spaces, and hyphens'
    })
});

// Middleware for hero search query validation
export const validateHeroSearch = (req: Request, res: Response, next: NextFunction) => {
  const { q } = req.query;

  // If no query is provided, skip validation
  if (!q) {
    return next();
  }

  // Validate search query
  const { error } = heroSearchSchema.validate({ q });

  if (error) {
    return res.status(400).json({
      error: 'Invalid search query',
      details: error.details[0].message
    });
  }

  next();
};