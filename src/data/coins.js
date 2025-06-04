/**
 * Mock cryptocurrency list data
 * @type {Array<{id: string, symbol: string, name: string}>}
 */
export const coinsList = [
  { id: 'bitcoin', symbol: 'btc', name: 'Bitcoin' },
  { id: 'ethereum', symbol: 'eth', name: 'Ethereum' },
  { id: 'cardano', symbol: 'ada', name: 'Cardano' },
  { id: 'dogecoin', symbol: 'doge', name: 'Dogecoin' },
  { id: 'ripple', symbol: 'xrp', name: 'Ripple' },
];

/**
 * Get filtered and sorted coin list
 * @param {Object} options - Filtering and sorting options
 * @param {string} [options.order] - Sorting order (asc/desc)
 * @param {string} [options.sortBy] - Field to sort by (id, symbol, name)
 * @returns {Array<{id: string, symbol: string, name: string}>} Filtered and sorted coins
 */
export function getFilteredCoinsList(options = {}) {
  const { order = 'asc', sortBy = 'id' } = options;
  
  // Validate sortBy parameter
  if (!['id', 'symbol', 'name'].includes(sortBy)) {
    throw new Error('Invalid sortBy parameter');
  }

  // Create a copy of the list to avoid mutating original
  let filteredList = [...coinsList];

  // Sort the list
  filteredList.sort((a, b) => {
    const valueA = a[sortBy].toLowerCase();
    const valueB = b[sortBy].toLowerCase();
    
    return order === 'asc' 
      ? valueA.localeCompare(valueB)
      : valueB.localeCompare(valueA);
  });

  return filteredList;
}