// Hero data with case-insensitive lookup
const heroData = {
  'spider-man': {
    name: 'Spider-Man',
    realName: 'Peter Parker',
    powers: ['Web-slinging', 'Spider-sense']
  },
  'iron-man': {
    name: 'Iron Man',
    realName: 'Tony Stark',
    powers: ['Genius-level intellect', 'Advanced armor']
  },
  'captain-america': {
    name: 'Captain America',
    realName: 'Steve Rogers',
    powers: ['Enhanced strength', 'Leadership']
  }
};

/**
 * Retrieve hero information by name
 * @param heroName - Case-insensitive hero name
 * @returns Hero object or undefined
 */
export function getHeroByName(heroName: string) {
  const normalizedHeroName = heroName.toLowerCase().replace(/\s+/g, '-');
  return heroData[normalizedHeroName];
}