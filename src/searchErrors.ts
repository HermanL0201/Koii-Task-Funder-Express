/**
 * Custom error classes for search functionality
 */
export class SearchError extends Error {
    statusCode: number;

    constructor(message: string, statusCode: number = 400) {
        super(message);
        this.name = 'SearchError';
        this.statusCode = statusCode;
    }
}

export class InvalidQueryError extends SearchError {
    constructor(message: string = 'Invalid search query') {
        super(message, 400);
        this.name = 'InvalidQueryError';
    }
}

export class EmptyResultError extends SearchError {
    constructor(message: string = 'No products found') {
        super(message, 404);
        this.name = 'EmptyResultError';
    }
}

export class SearchParamError extends SearchError {
    constructor(message: string = 'Invalid search parameters') {
        super(message, 400);
        this.name = 'SearchParamError';
    }
}