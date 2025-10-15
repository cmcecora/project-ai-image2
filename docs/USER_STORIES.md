# User Stories

## Epic 1: Core Gameplay

### US-1.1: Image Display
**As a** player
**I want to** see a large, clear image
**So that** I can examine it for AI characteristics

**Acceptance Criteria:**
- Image displays at minimum 600x600px on desktop
- Image scales responsively on mobile
- Loading indicator shows while image loads
- Images are high-resolution and clear
- Proper aspect ratio is maintained

### US-1.2: Making Choices
**As a** player
**I want to** make my choice using obvious buttons
**So that** I can easily indicate my decision

**Acceptance Criteria:**
- Two large, contrasting buttons labeled "AI" and "Not AI"
- Buttons have hover states and click feedback
- Buttons are thumb-reachable on mobile
- Clear visual hierarchy with the question "Is this photo AI?"
- Buttons are disabled during loading/processing

### US-1.3: Immediate Feedback
**As a** player
**I want to** see if I was correct immediately
**So that** I can learn from my mistakes

**Acceptance Criteria:**
- Result displays within 500ms of selection
- Clear indication of correct/incorrect (green/red)
- Explanation or hint about why it's AI or real
- No page reload during transition
- Smooth animation between states

### US-1.4: Community Comparison
**As a** player
**I want to** see how others voted
**So that** I can compare my judgment

**Acceptance Criteria:**
- Percentage breakdown of AI vs Not AI votes
- Total number of votes displayed
- Visual representation (progress bar or pie chart)
- Updates in real-time or near real-time
- Clear labeling of statistics

## Epic 2: Progress & Scoring

### US-2.1: Persistent Progress
**As a** player
**I want** my score to persist across sessions
**So that** I can track improvement

**Acceptance Criteria:**
- Score saves to localStorage
- Display current streak
- Show total games played
- Calculate and display accuracy percentage
- Handle browser storage limits gracefully

### US-2.2: Competitive Leaderboard
**As a** player
**I want to** see my ranking on a leaderboard
**So that** I can compete with others

**Acceptance Criteria:**
- Global leaderboard showing top 100 players
- Display username, score, and accuracy
- Highlight current user's position
- Update every 15 minutes
- Handle tie-breaking rules

### US-2.3: Seamless Continuation
**As a** player
**I want to** continue playing seamlessly
**So that** I can stay engaged

**Acceptance Criteria:**
- "Next" button loads new image without page reload
- Preload next image during result viewing
- Maintain smooth transitions
- Ad refresh without disrupting gameplay
- Preserve game state during navigation

## Epic 3: Mobile Experience

### US-3.1: Swipe Gestures
**As a** mobile user
**I want to** swipe to make choices
**So that** the interaction feels natural

**Acceptance Criteria:**
- Right swipe = "AI", Left swipe = "Not AI"
- Visual feedback during swipe
- Swipe threshold prevents accidental choices
- Option to use buttons if preferred
- Gesture tutorial for first-time users

### US-3.2: Responsive Layout
**As a** mobile user
**I want** the layout to adapt to my screen
**So that** everything is readable

**Acceptance Criteria:**
- Single column layout on mobile
- Ads reposition to not obstruct gameplay
- Text remains readable (minimum 14px)
- Touch targets minimum 44x44px
- Proper viewport meta tag configuration

## Epic 4: Social Features

### US-4.1: Social Sharing
**As a** player
**I want to** share my results on social media
**So that** I can challenge friends

**Acceptance Criteria:**
- Share buttons for Twitter/X, Facebook, LinkedIn
- Pre-populated text with score and link
- Custom Open Graph image for shares
- Track share analytics
- Fallback for native sharing on mobile

### US-4.2: Specific Result Sharing
**As a** player
**I want to** share specific surprising results
**So that** I can discuss with others

**Acceptance Criteria:**
- Share individual image results
- Include voting statistics in share
- Preserve privacy (no personal data in URLs)
- Generate unique share links
- Preview of share content before posting

## Epic 5: Content & Quality

### US-5.1: Diverse Content
**As a** player
**I want to** see diverse, high-quality images
**So that** the game stays interesting

**Acceptance Criteria:**
- Mix of portraits, landscapes, objects, scenes
- Balance of difficulty levels
- No repeat images in single session
- Proper attribution and source links
- Regular content updates

### US-5.2: Educational Value
**As a** player
**I want to** learn about AI images
**So that** I can improve my detection skills

**Acceptance Criteria:**
- Display image source (DALL-E, Midjourney, etc.)
- Link to original or creator
- Educational tips about AI image characteristics
- Optional "Learn More" resources
- Contextual hints based on image type

## Epic 6: Monetization & Ads

### US-6.1: Non-Intrusive Ads
**As a** player
**I want** ads that don't disrupt gameplay
**So that** I can focus on the game

**Acceptance Criteria:**
- Ads load asynchronously
- Fixed positions that don't shift content
- Mobile-optimized ad sizes
- Graceful handling of ad blockers
- No auto-playing video ads

### US-6.2: Ad Refresh
**As a** player
**I want** ads to refresh appropriately
**So that** content stays relevant

**Acceptance Criteria:**
- Ads refresh on "Next" button click
- No refresh during active gameplay
- Maintain ad position during refresh
- Handle failed ad loads gracefully
- Respect user's ad preferences

## Epic 7: Error Handling & Edge Cases

### US-7.1: Offline Functionality
**As a** player
**I want** the game to handle offline scenarios
**So that** I'm not stuck if connection drops

**Acceptance Criteria:**
- Clear offline indicator
- Cache recent images for offline play
- Queue votes for when connection returns
- Graceful degradation of features
- Automatic reconnection attempts

### US-7.2: Error Recovery
**As a** player
**I want** clear error messages and recovery options
**So that** I can continue playing

**Acceptance Criteria:**
- User-friendly error messages
- Retry mechanisms for failed requests
- Fallback content for failed image loads
- Preserve game state during errors
- Contact/support information for persistent issues

## User Personas

### Persona 1: Casual Gamer (Primary)
- **Age**: 25-45
- **Tech Savvy**: Medium
- **Motivation**: Entertainment, curiosity
- **Usage**: 5-10 minutes per session, 2-3 times per week
- **Device**: Primarily mobile (70%), desktop (30%)

### Persona 2: AI Enthusiast
- **Age**: 20-35
- **Tech Savvy**: High
- **Motivation**: Learning, testing knowledge
- **Usage**: 10-20 minutes per session, daily
- **Device**: Mixed mobile and desktop

### Persona 3: Competitive Player
- **Age**: 18-30
- **Tech Savvy**: Medium-High
- **Motivation**: Competition, achievement
- **Usage**: 15-30 minutes per session, multiple times daily
- **Device**: Desktop for serious play, mobile for casual

## Success Metrics per Epic

| Epic | Key Metrics | Target |
|------|------------|--------|
| Core Gameplay | Completion Rate | >80% |
| Progress & Scoring | Return User Rate | >30% |
| Mobile Experience | Mobile Usage | >60% |
| Social Features | Share Rate | >5% |
| Content Quality | Accuracy Distribution | 60-70% |
| Monetization | Ad Revenue per User | >$0.10 |
| Error Handling | Error Rate | <1% |