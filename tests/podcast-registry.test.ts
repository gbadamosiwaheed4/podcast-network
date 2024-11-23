import { describe, it, expect, beforeEach } from 'vitest';

// Simulated contract state
let podcasts: Map<number, {
  owner: string,
  name: string,
  description: string,
  rssFeed: string
}>;
let nextPodcastId: number;

// Simulated contract functions
function registerPodcast(caller: string, name: string, description: string, rssFeed: string): number {
  const podcastId = nextPodcastId;
  podcasts.set(podcastId, { owner: caller, name, description, rssFeed });
  nextPodcastId++;
  return podcastId;
}

function getPodcast(podcastId: number) {
  const podcast = podcasts.get(podcastId);
  if (!podcast) {
    throw new Error('ERR_NOT_FOUND');
  }
  return podcast;
}

function updatePodcast(caller: string, podcastId: number, name: string, description: string, rssFeed: string): boolean {
  const podcast = podcasts.get(podcastId);
  if (!podcast) {
    throw new Error('ERR_NOT_FOUND');
  }
  if (podcast.owner !== caller) {
    throw new Error('ERR_OWNER_ONLY');
  }
  podcasts.set(podcastId, { ...podcast, name, description, rssFeed });
  return true;
}

describe('podcast-registry contract test suite', () => {
  beforeEach(() => {
    podcasts = new Map();
    nextPodcastId = 0;
  });
  
  it('should register a new podcast', () => {
    const podcastId = registerPodcast('user1', 'My Podcast', 'A great podcast', 'https://mypodcast.com/rss');
    expect(podcastId).toBe(0);
    expect(podcasts.size).toBe(1);
  });
  
  it('should retrieve podcast details', () => {
    registerPodcast('user1', 'My Podcast', 'A great podcast', 'https://mypodcast.com/rss');
    const podcast = getPodcast(0);
    expect(podcast).toEqual({
      owner: 'user1',
      name: 'My Podcast',
      description: 'A great podcast',
      rssFeed: 'https://mypodcast.com/rss'
    });
  });
  
  it('should update podcast details when called by owner', () => {
    registerPodcast('user1', 'My Podcast', 'A great podcast', 'https://mypodcast.com/rss');
    const result = updatePodcast('user1', 0, 'Updated Podcast', 'An updated great podcast', 'https://updatedpodcast.com/rss');
    expect(result).toBe(true);
    const updatedPodcast = getPodcast(0);
    expect(updatedPodcast).toEqual({
      owner: 'user1',
      name: 'Updated Podcast',
      description: 'An updated great podcast',
      rssFeed: 'https://updatedpodcast.com/rss'
    });
  });
  
  it('should fail to update podcast details when called by non-owner', () => {
    registerPodcast('user1', 'My Podcast', 'A great podcast', 'https://mypodcast.com/rss');
    expect(() => updatePodcast('user2', 0, 'Hacked Podcast', 'A hacked podcast', 'https://hackedpodcast.com/rss'))
        .toThrow('ERR_OWNER_ONLY');
  });
  
  it('should fail to get non-existent podcast', () => {
    expect(() => getPodcast(0)).toThrow('ERR_NOT_FOUND');
  });
  
  it('should fail to update non-existent podcast', () => {
    expect(() => updatePodcast('user1', 0, 'Updated Podcast', 'An updated great podcast', 'https://updatedpodcast.com/rss'))
        .toThrow('ERR_NOT_FOUND');
  });
});

