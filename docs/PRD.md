# Product Requirements Document (PRD)

## 1. Executive Summary

### Product Name: AI or Not? - The Ultimate Image Detection Game

### Vision Statement
Create an engaging, educational, and monetizable web game that challenges users to distinguish between AI-generated and real photographs, while building awareness about the advancing capabilities of AI image generation.

### Problem Statement
With the rapid advancement of AI image generation technology, it's becoming increasingly difficult to distinguish between real and AI-generated images. This creates both educational opportunities and potential risks for digital literacy.

### Solution
An interactive, gamified platform that:
- Tests users' ability to identify AI-generated images
- Provides immediate feedback and educational insights
- Tracks performance and creates competitive engagement through scoring
- Monetizes through strategic ad placement

## 2. Core Features & Functionality

### 2.1 Primary Game Loop
- **Image Display**: Large, centered image presentation
- **Binary Choice Interface**: Prominent "AI" and "Not AI" buttons
- **Instant Feedback**: Results page showing:
  - Correct answer
  - Community voting percentages
  - Total votes
  - Image source and credits
  - User's current score
  - Running statistics (correct/incorrect)
- **Continuous Play**: "Next" button to load new challenge without page reload

### 2.2 Gamification Elements
- **Persistent Scoring**: Track lifetime statistics using localStorage
- **Leaderboard**: Global rankings showing top performers
- **Streak Tracking**: Consecutive correct answers
- **Achievement System**: Milestones for accuracy and volume

### 2.3 Social Features
- **Share Results**: Social media integration for sharing individual results or achievements
- **Community Statistics**: Real-time voting data from all users

### 2.4 Mobile Experience
- **Responsive Design**: Optimized layouts for all screen sizes
- **Swipe Gestures**: Left swipe for "Not AI", Right swipe for "AI"
- **Touch-Optimized**: Large, thumb-friendly interaction areas

### 2.5 Monetization
- **Display Advertising**: 4 strategic banner placements
  - Top banner (728x90 leaderboard)
  - Bottom banner (728x90 leaderboard)
  - Left sidebar (160x600 skyscraper)
  - Right sidebar (160x600 skyscraper)
- **High-quality ad network integration** (Google AdSense recommended)

## 3. Technical Requirements

### 3.1 Performance
- Page load time < 2 seconds
- Image lazy loading with progressive enhancement
- Smooth transitions between game states
- No full page reloads during gameplay

### 3.2 Data Management
- Persistent storage of all voting data
- Real-time aggregation of community statistics
- Efficient caching strategy for images
- API rate limit management

### 3.3 Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge - last 2 versions)
- Mobile responsive (iOS Safari, Chrome Mobile)
- Progressive Web App capabilities

## 4. Success Metrics

### 4.1 Engagement Metrics
- **Daily Active Users (DAU)**
- **Average Session Duration** (target: >5 minutes)
- **Images Rated per Session** (target: >10)
- **Return User Rate** (target: >30%)

### 4.2 Monetization Metrics
- **Ad Revenue per User (ARPU)**
- **Click-Through Rate (CTR)**
- **Page Views per Session**

### 4.3 Quality Metrics
- **Accuracy Distribution** (bell curve centered ~60-70%)
- **User Satisfaction Score**
- **Social Share Rate**

## 5. User Requirements Summary

Based on stakeholder input, the following requirements have been confirmed:

### Image Sources
- High-quality, free-to-use APIs
- Mix of real photos (stock photos) and AI-generated images
- Include various AI generators (DALL-E, Midjourney, Stable Diffusion, Leonardo.ai)
- Infinite rotation with dynamic fetching

### Scoring & Gamification
- Persistent scores across sessions via localStorage
- Global leaderboard feature
- No difficulty levels or categories
- Manual progression (click "Next" to continue)

### Advertising
- High-quality digital display banner ads
- 4 placement zones (top, bottom, left, right)
- Google AdSense or similar premium network

### Data & Analytics
- Permanent storage of voting data
- No detailed click tracking needed
- No admin panel required

### Mobile Experience
- Responsive scaling (not separate layouts)
- Swipe gestures (left = Not AI, right = AI)
- Dating app-style interaction

### Social Features
- Share results on social media
- No user-submitted images

## 6. Out of Scope

The following features are explicitly NOT included in the initial release:
- User accounts and authentication
- Difficulty levels or image categories
- Detailed analytics (time spent, click patterns)
- Admin panel for image management
- User-submitted images
- Alternative monetization (premium features, subscriptions)
- Auto-advance between images
- Native mobile apps

## 7. Future Considerations

Potential features for future releases:
- Category-based challenges (portraits, landscapes, etc.)
- Daily challenges and special events
- Achievement badges and rewards
- User profiles and customization
- Tournament mode and competitions
- Educational mode with hints and tutorials
- API for third-party integrations
- Premium ad-free experience