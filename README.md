# Decentralized Autonomous Podcast Network

A platform where podcasters can publish content, listeners can subscribe, and advertisers can place ads, all managed by smart contracts. The platform implements features like automated revenue sharing and listener-driven content curation.

## Features

- **Podcast Registry**: Allows podcasters to register and manage their podcasts
- **Subscription Management**: Handles listener subscriptions to podcasts
- **Ad Management**: Manages ad placements, budgets, and payments
- **Revenue Distribution**: Automated revenue sharing between podcasters, platform, and advertisers
- **Content Curation**: Listener-driven content curation through ratings and reviews

## Smart Contracts

### PodcastRegistry
- Register new podcasts
- Update podcast details
- Retrieve podcast information

### SubscriptionManager
- Subscribe to podcasts
- Unsubscribe from podcasts
- Check subscription status

### AdManager
- Place ads on podcasts
- Manage ad budgets
- Track ad performance

### RevenueDistribution
- Set revenue shares
- Distribute revenue automatically
- Track earnings

### ContentCuration
- Rate podcasts
- Get podcast ratings
- Track user ratings

## Testing

The project uses Vitest for testing. To run the tests:

```bash
npm test

