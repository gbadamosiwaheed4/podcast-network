import { describe, it, expect, beforeEach } from 'vitest';

// Simulated contract state
let podcastRatings: Map<number, { totalRating: number, numRatings: number }>;
let userRatings: Map<string, Map<number, number>>;

// Simulated contract functions
function ratePodcast(caller: string, podcastId: number, rating: number): boolean {
  if (rating < 1 || rating > 5) {
    throw new Error('ERR_INVALID_RATING');
  }
  
  const userPodcastKey = `${caller}-${podcastId}`;
  if (userRatings.get(caller)?.has(podcastId)) {
    throw new Error('ERR_ALREADY_VOTED');
  }
  
  // Update podcast ratings
  const currentRatings = podcastRatings.get(podcastId) || { totalRating: 0, numRatings: 0 };
  podcastRatings.set(podcastId, {
    totalRating: currentRatings.totalRating + rating,
    numRatings: currentRatings.numRatings + 1
  });
  
  // Update user ratings
  if (!userRatings.has(caller)) {
    userRatings.set(caller, new Map());
  }
  userRatings.get(caller)!.set(podcastId, rating);
  
  return true;
}

function getPodcastRating(podcastId: number): { averageRating: number, numRatings: number } {
  const ratings = podcastRatings.get(podcastId);
  if (!ratings) {
    throw new Error('ERR_NOT_FOUND');
  }
  return {
    averageRating: Math.floor((ratings.totalRating * 100) / ratings.numRatings) / 100,
    numRatings: ratings.numRatings
  };
}

function getUserRating(user: string, podcastId: number): number {
  const userRating = userRatings.get(user)?.get(podcastId);
  if (userRating === undefined) {
    throw new Error('ERR_NOT_FOUND');
  }
  return userRating;
}

describe('content-curation contract test suite', () => {
  beforeEach(() => {
    podcastRatings = new Map();
    userRatings = new Map();
  });
  
  it('should rate a podcast successfully', () => {
    const result = ratePodcast('user1', 1, 4);
    expect(result).toBe(true);
    expect(podcastRatings.get(1)).toEqual({ totalRating: 4, numRatings: 1 });
    expect(userRatings.get('user1')?.get(1)).toBe(4);
  });
  
  it('should fail to rate a podcast with an invalid rating', () => {
    expect(() => ratePodcast('user1', 1, 6)).toThrow('ERR_INVALID_RATING');
    expect(() => ratePodcast('user1', 1, 0)).toThrow('ERR_INVALID_RATING');
  });
  
  it('should fail to rate a podcast twice by the same user', () => {
    ratePodcast('user1', 1, 4);
    expect(() => ratePodcast('user1', 1, 5)).toThrow('ERR_ALREADY_VOTED');
  });
  
  it('should get podcast rating correctly', () => {
    ratePodcast('user1', 1, 4);
    ratePodcast('user2', 1, 5);
    const rating = getPodcastRating(1);
    expect(rating).toEqual({ averageRating: 4.5, numRatings: 2 });
  });
  
  it('should fail to get rating for non-existent podcast', () => {
    expect(() => getPodcastRating(999)).toThrow('ERR_NOT_FOUND');
  });
  
  it('should get user rating correctly', () => {
    ratePodcast('user1', 1, 4);
    const rating = getUserRating('user1', 1);
    expect(rating).toBe(4);
  });
  
  it('should fail to get rating for non-existent user-podcast combination', () => {
    expect(() => getUserRating('user1', 999)).toThrow('ERR_NOT_FOUND');
  });
  
  it('should handle multiple podcast ratings', () => {
    ratePodcast('user1', 1, 4);
    ratePodcast('user2', 1, 5);
    ratePodcast('user1', 2, 3);
    ratePodcast('user2', 2, 2);
    
    expect(getPodcastRating(1)).toEqual({ averageRating: 4.5, numRatings: 2 });
    expect(getPodcastRating(2)).toEqual({ averageRating: 2.5, numRatings: 2 });
    expect(getUserRating('user1', 1)).toBe(4);
    expect(getUserRating('user2', 2)).toBe(2);
  });
});
