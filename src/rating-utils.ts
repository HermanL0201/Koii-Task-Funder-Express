/**
 * Calculates the aggregate rating for a product based on its reviews
 * @param reviews Array of review objects with a rating property
 * @returns Aggregate rating rounded to 2 decimal places, or 0 if no reviews
 */
export function calculateAggregateRating(reviews: Array<{ rating: number }>): number {
  // Handle empty reviews case
  if (!reviews || reviews.length === 0) {
    return 0;
  }

  // Calculate average rating
  const totalRating = reviews.reduce((sum, review) => {
    // Validate individual rating 
    if (typeof review.rating !== 'number' || isNaN(review.rating)) {
      throw new Error('Invalid review rating');
    }

    // Ensure rating is within valid range (1-5)
    if (review.rating < 1 || review.rating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }

    return sum + review.rating;
  }, 0);

  // Calculate and round to 2 decimal places
  return Number((totalRating / reviews.length).toFixed(2));
}