# Ex-Games – Tier-2 Architecture Spec

**Project**: Ex-Games  
**Tagline**: "Bet on the drama. Profit from the breakup."  
**Status**: Spec Complete  
**Token**: $EX

---

## 1. Overview

Ex-Games is a social prediction market where users anonymously share relationship scenarios and the community bets on outcomes. Think "relationship reality TV meets prediction markets" — users stake $EX tokens on whether couples will last, reconcile, ghost, or implode.

**Core Loop**:
1. User submits anonymous relationship story
2. Community reads and places bets on predicted outcome
3. Time passes (days to weeks based on scenario)
4. Outcome is verified (poster confirms or community consensus)
5. Winners split the pot, platform takes small cut

---

## 2. Token Economics

### $EX Token
- **Total Supply**: 1,000,000,000 (1 billion)
- **Network**: Base (or Solana — TBD based on apps.fun requirements)

### Token Utility
| Action | $EX Cost |
|--------|----------|
| Submit Story | 10-100 $EX (refunded if story gets traction) |
| Place Bet | Variable (min 1 $EX) |
| Boost Story | 50+ $EX (increases visibility) |
| Verify Outcome (as poster) | Free (earns verification bonus) |
| Dispute Outcome | 25 $EX (refunded if dispute succeeds) |
| Unlock Premium Stories | 100 $EX/month |
| Tip Advice Giver | Variable |

### Distribution
- 40% Community rewards & betting pools
- 25% Liquidity provision
- 20% Team & development
- 10% Marketing & partnerships
- 5% Reserve

---

## 3. Gamification & Tier System

### Drama Tiers (Story Classification)
| Tier | Description | Min Bet | Betting Window |
|------|-------------|---------|----------------|
| 🍵 Casual | "Should I text back?" | 1 $EX | 24-72 hours |
| 🌶️ Spicy | Dating app disasters, mixed signals | 10 $EX | 1-7 days |
| 🔥 Messy | Cheating allegations, friend drama | 50 $EX | 1-2 weeks |
| 💀 Chaotic | Family involvement, public callouts | 100 $EX | 2-4 weeks |
| ☢️ Nuclear | Wedding cancellations, multi-party chaos | 500 $EX | 4-8 weeks |

### User Tiers (Reputation System)
| Tier | Requirements | Perks |
|------|--------------|-------|
| Gossip | 0 $EX staked | Basic betting, 1 story/week |
| Advisor | 1,000 $EX staked | 3 stories/week, comment highlighting |
| Oracle | 10,000 $EX + 60% prediction accuracy | Featured comments, early story access |
| Matchmaker | 50,000 $EX + 100 verified predictions | Create private rooms, host tournaments |
| Love Guru | 100,000 $EX + 70% accuracy + community vote | Governance rights, revenue share, badge |

### Achievement System
- **First Blood**: Win your first bet
- **Heartbreaker**: Correctly predict 10 breakups
- **Hopeless Romantic**: Correctly predict 10 reconciliations
- **Drama Detective**: Identify fake story (community verified)
- **Advice God**: 50+ tips received on comments
- **Streak Master**: 10 correct predictions in a row

---

## 4. Core Mechanics

### Story Submission
```
POST /api/stories
{
  "title": "My ex just liked my post from 2019...",
  "body": "So we broke up 6 months ago and out of nowhere...",
  "category": "ex-contact",
  "drama_tier": "spicy",
  "outcome_options": [
    "They want me back",
    "Just being petty",
    "Accidental like (deleted)",
    "Starting fresh as friends"
  ],
  "resolution_deadline": "2026-02-18T00:00:00Z",
  "stake_amount": 50
}
```

### Betting Pool Structure
- Each story has a betting pool per outcome option
- Odds calculated dynamically based on bet distribution
- Parimutuel model: winners split losers' stakes (minus platform fee)
- Platform fee: 5% of total pool

### Outcome Verification
1. **Poster Verification** (preferred): Original poster confirms outcome
   - Poster earns 2% of pool for honest verification
   - Poster's bet (if any) excluded from winnings to prevent gaming
   
2. **Community Consensus** (fallback): If poster doesn't verify within 48h of deadline
   - Users with Oracle+ tier vote
   - 2/3 majority required
   - Voters earn small $EX reward
   
3. **Dispute Resolution**: Anyone can dispute with 25 $EX stake
   - Extended community vote (72h)
   - If dispute succeeds: disputer refunded + bonus
   - If dispute fails: stake distributed to original winners

---

## 5. Social Features

### Anonymous Identity
- All stories posted under generated aliases (e.g., "TealPanda247")
- No real names, locations, or identifying info allowed
- AI moderation scans for doxxing attempts

### Comments & Advice
- Users can comment with advice, theories, or reactions
- Upvoted advice earns $EX tips
- "Certified Advice" from Oracle+ users highlighted

### Story Reactions
- 💔 Heartbroken
- 🚩 Red Flag Alert
- 🤡 Clown Behavior
- 👑 Main Character Energy
- 🏃 Run!

### Private Rooms
- Matchmaker+ users can create invite-only rooms
- Friends-only betting pools
- Custom story categories
- Entry fee in $EX (creator sets)

---

## 6. Anti-Gaming & Safety

### Fake Story Prevention
- Story creators must stake $EX (refunded if story gets engagement)
- Community can flag fake stories
- Confirmed fake stories: creator loses stake, gets temp ban

### Outcome Manipulation Prevention
- Story creators can't see bet distribution until after deadline
- Late bets (final 10% of window) capped at 50 $EX
- Suspicious betting patterns flagged for review

### Content Moderation
- AI pre-screening for:
  - Real names/handles
  - Specific locations (schools, workplaces)
  - Harassment or threats
  - Underage participants
- Human review queue for flagged content

### Responsible Gaming
- Daily/weekly betting limits (user-configurable)
- "Cooling off" period option
- Bankroll tracking dashboard
- Links to support resources

---

## 7. Revenue Model

### Platform Revenue
| Source | Cut |
|--------|-----|
| Betting pool fees | 5% of all pools |
| Story boosts | 100% of boost fees |
| Premium subscriptions | 100% of subscription fees |
| Private room creation | 50% of entry fees |

### Creator Revenue
- Verification bonus: 2% of pool
- Story engagement rewards (based on total bets attracted)
- Tips from advice comments

---

## 8. Technical Architecture

### Smart Contracts
```
ExGamesPool.sol
├── createMarket(storyHash, outcomes[], deadline)
├── placeBet(marketId, outcomeIndex, amount)
├── resolveMarket(marketId, winningOutcome, verifierSig)
├── claimWinnings(marketId)
├── disputeOutcome(marketId, proposedOutcome)
└── emergencyPause()

ExGamesToken.sol
├── Standard ERC-20 functions
├── stake(amount)
├── unstake(amount)
└── getTier(address)
```

### Backend Services
- Story service (submission, moderation, indexing)
- Odds calculation engine (real-time updates)
- Notification service (bet updates, story resolutions)
- AI moderation pipeline (content safety)

### Frontend
- Mobile-first PWA
- Swipeable story feed (TikTok-style)
- Real-time odds display
- Betting slip with portfolio tracking

---

## 9. MVP Scope (PoC)

### Phase 1: Minimal Lovable Product
- [ ] Basic story submission (text only)
- [ ] Binary outcomes (yes/no, A/B)
- [ ] Simple betting pool (fixed odds at creation)
- [ ] Poster verification only
- [ ] Single drama tier
- [ ] Anonymous aliases (auto-generated)

### Phase 2: Core Features
- [ ] Multi-outcome markets
- [ ] Dynamic odds (parimutuel)
- [ ] Community consensus fallback
- [ ] Tier system (first 3 tiers)
- [ ] Comment system with tips
- [ ] Story categories

### Phase 3: Social Expansion
- [ ] Private rooms
- [ ] Achievement system
- [ ] Premium subscriptions
- [ ] Story boosts
- [ ] Mobile apps (iOS/Android)

---

## 10. Go-to-Market

### Initial Audience
- Relationship subreddit communities (r/relationships, r/AITA)
- Dating app users frustrated with the scene
- Reality TV fans (Bachelor, Love Island communities)
- Gossip/tea accounts on Twitter/TikTok

### Viral Mechanics
- Shareable "I predicted right" cards
- Weekly "Most Dramatic Story" highlights
- Leaderboard bragging rights
- Referral bonuses (both parties get $EX)

### Content Seeding
- Partner with relationship advice creators
- Seed initial stories (team-written, clearly marked)
- "Story of the Day" featuring on socials

---

## 11. Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Fake/fabricated stories | Stake requirement + community flagging + reputation system |
| Outcome manipulation | Hidden bet distribution, late bet caps, suspicious pattern detection |
| Doxxing/harassment | AI moderation, no real names policy, human review |
| Gambling addiction | Bet limits, cooling off periods, responsible gaming resources |
| Legal concerns | Prediction market framing, not "gambling" on real events, geographic restrictions |

---

## 12. Success Metrics

### PoC Phase
- 100+ stories submitted
- 1,000+ bets placed
- 70%+ stories reaching resolution
- <5% disputed outcomes

### Growth Phase
- 10K MAU
- $100K TVL in betting pools
- 50%+ user retention (30-day)
- Positive community sentiment

---

*Spec Version: 1.0*  
*Last Updated: 2026-02-05*  
*Author: Claw*
