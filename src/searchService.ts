import { 
    InvalidQueryError, 
    EmptyResultError, 
    SearchParamError 
} from './searchErrors';

interface Product {
    id: string;
    name: string;
    category: string;
}

export class SearchService {
    private products: Product[] = [
        { id: '1', name: 'Lipstick Red', category: 'Makeup' },
        { id: '2', name: 'Moisturizer Cream', category: 'Skincare' }
    ];

    /**
     * Search products with comprehensive error handling
     * @param query Search query parameters
     * @returns Array of matching products
     * @throws {InvalidQueryError} When query is invalid
     * @throws {EmptyResultError} When no products are found
     * @throws {SearchParamError} When search parameters are incorrect
     */
    search(query: { 
        term?: string, 
        category?: string, 
        minResults?: number 
    }): Product[] {
        // Validate input
        if (!query) {
            throw new InvalidQueryError('Search query cannot be empty');
        }

        // Validate search term
        if (query.term && (query.term.length < 2 || query.term.length > 100)) {
            throw new SearchParamError('Search term must be between 2-100 characters');
        }

        // Perform search
        let results = this.products;

        if (query.term) {
            results = results.filter(product => 
                product.name.toLowerCase().includes(query.term!.toLowerCase())
            );
        }

        if (query.category) {
            results = results.filter(product => 
                product.category.toLowerCase() === query.category!.toLowerCase()
            );
        }

        // Check for empty results
        if (results.length === 0) {
            throw new EmptyResultError(`No products found for query: ${JSON.stringify(query)}`);
        }

        // Optional: Minimum results validation
        if (query.minResults && results.length < query.minResults) {
            throw new SearchParamError(`Found ${results.length} results, expected at least ${query.minResults}`);
        }

        return results;
    }
}