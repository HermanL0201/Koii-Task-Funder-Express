import { describe, it, expect } from 'vitest';
import { getHeroByName } from '../src/controllers/heroController';

describe('Hero Controller', () => {
  it('should retrieve hero by name (case-insensitive)', () => {
    const spiderMan = getHeroByName('spider-man');
    const spiderManAlternate = getHeroByName('Spider Man');
    
    expect(spiderMan).toBeDefined();
    expect(spiderManAlternate).toBeDefined();
    expect(spiderMan).toEqual(spiderManAlternate);
    expect(spiderMan?.name).toBe('Spider-Man');
  });

  it('should return undefined for non-existent hero', () => {
    const unknownHero = getHeroByName('random-hero');
    
    expect(unknownHero).toBeUndefined();
  });
});