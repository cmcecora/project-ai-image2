# User Flows

## Flow 1: First-Time User Journey

```mermaid
graph TD
    A[User Lands on Homepage] --> B[See First Image + Question]
    B --> C{Make Choice: AI or Not?}
    C -->|Click/Swipe| D[Show Results Page]
    D --> E[Display Correct Answer]
    E --> F[Show Community Stats]
    F --> G[Initialize Score: 0/1 or 1/1]
    G --> H{User Action}
    H -->|Click Next| I[Load New Image]
    H -->|Share Result| J[Open Share Dialog]
    I --> C
    J --> K[Return to Results]
    K --> H
```

### Description
This flow represents a new user's first interaction with the platform. They immediately see an image and must make a decision. After choosing, they see the results, community statistics, and their initial score. The flow emphasizes immediate engagement without registration barriers.

### Key Decision Points
- Initial choice: AI or Not AI
- Post-result action: Continue playing or share

### Success Metrics
- Time to first interaction: <5 seconds
- First session completion rate: >80%
- Share rate for first-time users: >3%

---

## Flow 2: Returning User Experience

```mermaid
graph TD
    A[User Returns to Site] --> B[Load Saved Score from LocalStorage]
    B --> C[Display Current Stats in Header]
    C --> D[Show New Image]
    D --> E{Make Choice}
    E -->|Correct| F[Increment Score & Streak]
    E -->|Incorrect| G[Update Score, Reset Streak]
    F --> H[Show Results with Updated Stats]
    G --> H
    H --> I{Continue Playing?}
    I -->|Yes| D
    I -->|Check Leaderboard| J[View Rankings]
    J --> K[Find User Position]
    K --> I
```

### Description
Returning users have their progress automatically loaded from localStorage. Their current statistics are visible, creating continuity between sessions. The leaderboard provides competitive motivation.

### Key Features
- Automatic score restoration
- Visible progress indicators
- Seamless continuation of gameplay
- Access to competitive features

### Success Metrics
- Returning user rate: >30%
- Average session length increase: >20%
- Leaderboard engagement: >15%

---

## Flow 3: Mobile Swipe Interaction

```mermaid
graph TD
    A[Mobile User Views Image] --> B{Swipe Gesture}
    B -->|Swipe Right| C[Register as 'AI']
    B -->|Swipe Left| D[Register as 'Not AI']
    B -->|Tap Buttons| E[Use Standard Button Flow]
    C --> F[Animate Card Right]
    D --> G[Animate Card Left]
    F --> H[Process Vote]
    G --> H
    H --> I[Show Results Overlay]
    I --> J[Swipe or Tap for Next]
    J --> A
```

### Description
Mobile users can interact through intuitive swipe gestures similar to dating apps. The flow includes visual feedback through card animations and maintains the option for traditional button interaction.

### Gesture Mapping
- **Right Swipe**: AI-generated image
- **Left Swipe**: Real photograph
- **Tap**: Use traditional buttons

### Mobile Optimization
- Touch target size: minimum 44x44px
- Swipe sensitivity: 30% of screen width
- Animation duration: 300ms
- Haptic feedback on supported devices

---

## Flow 4: Results and Statistics Display

```mermaid
graph TD
    A[User Makes Choice] --> B[Send Vote to API]
    B --> C[Store in Database]
    C --> D[Calculate Statistics]
    D --> E[Return Results]
    E --> F[Update UI Without Reload]
    F --> G[Display Result Card]
    G --> H[Show Correct Answer]
    H --> I[Display Vote Percentages]
    I --> J[Show Image Credits]
    J --> K[Update User Score]
    K --> L[Display Updated Stats]
    L --> M[Prefetch Next Image]
```

### Description
This flow details the backend processing and frontend updates that occur after a user makes their choice. The system processes the vote, updates statistics, and prepares for the next round while showing results.

### Technical Details
- API response time: <200ms
- Database write: Asynchronous
- Statistics calculation: Real-time aggregation
- UI update: No page reload
- Next image prefetch: During result display

### Information Displayed
1. Correct/Incorrect indicator
2. Community voting percentages
3. Total number of votes
4. Image source and credits
5. Updated personal score
6. Current streak status

---

## Flow 5: Ad Display Lifecycle

```mermaid
graph TD
    A[Page Initial Load] --> B[Initialize Ad Slots]
    B --> C[Request Ads from Network]
    C --> D[Display Initial Ads]
    D --> E[User Plays Game]
    E --> F{User Clicks Next}
    F --> G[Keep Static Ad Positions]
    G --> H[Refresh Ad Content]
    H --> I[Load New Game Image]
    I --> J[Continue Gameplay]
    J --> F
```

### Description
Advertisement display and refresh cycle that maintains user experience while maximizing ad revenue. Ads refresh with new game rounds but positions remain static to prevent layout shift.

### Ad Placement Strategy
- **Desktop**: 4 banner positions (top, bottom, left, right)
- **Mobile**: 2 positions (top and bottom only)
- **Refresh Rate**: On "Next" button click
- **Load Priority**: Async, non-blocking

### Performance Considerations
- Lazy loading for below-fold ads
- Fallback for ad blocker users
- No impact on Core Web Vitals
- Graceful degradation

---

## Flow 6: Error Handling States

```mermaid
graph TD
    A[User Action] --> B{Check Connection}
    B -->|Online| C[Process Normally]
    B -->|Offline| D[Show Offline Message]
    C --> E{API Response}
    E -->|Success| F[Continue Flow]
    E -->|Error| G[Show Error State]
    E -->|Rate Limited| H[Show Rate Limit Message]
    G --> I[Offer Retry]
    H --> J[Implement Cooldown]
    I --> A
    J --> K[Enable After Cooldown]
    K --> A
```

### Description
Comprehensive error handling ensures users can recover from various failure scenarios without losing progress or leaving the platform.

### Error Types & Responses

| Error Type | User Message | Recovery Action |
|------------|--------------|-----------------|
| Network Offline | "No internet connection" | Enable offline mode |
| API Error | "Something went wrong" | Retry button |
| Rate Limited | "Too many requests" | Cooldown timer |
| Image Load Failed | "Image unavailable" | Skip to next |
| Database Error | "Score save failed" | Queue for retry |

### Offline Mode Features
- Cache last 10 images
- Store votes locally
- Sync when reconnected
- Limited functionality indicator

---

## Flow 7: Social Sharing Flow

```mermaid
graph TD
    A[User Clicks Share] --> B{Platform Selection}
    B -->|Twitter/X| C[Generate Twitter Card]
    B -->|Facebook| D[Generate FB Post]
    B -->|Copy Link| E[Copy to Clipboard]
    C --> F[Open Twitter Dialog]
    D --> G[Open FB Dialog]
    E --> H[Show Success Toast]
    F --> I[Track Share Event]
    G --> I
    H --> I
    I --> J[Return to Game]
```

### Description
Social sharing flow allows users to share their results or specific interesting images with their networks, driving viral growth.

### Share Content Templates

**Score Share**:
```
I just scored 8/10 on AI or Not!
Can you beat my score at detecting AI images?
🤖 vs 📸
[link]
```

**Image Share**:
```
82% of people thought this was AI, but it's real!
Test your AI detection skills:
[link]
```

### Technical Implementation
- Open Graph meta tags
- Twitter Card support
- Native share API on mobile
- Clipboard fallback
- Analytics tracking

---

## Flow 8: Leaderboard Interaction

```mermaid
graph TD
    A[User Clicks Leaderboard] --> B[Load Top 100]
    B --> C[Display Rankings]
    C --> D{User in Top 100?}
    D -->|Yes| E[Highlight User Row]
    D -->|No| F[Show User Rank Separately]
    E --> G[Show Nearby Players]
    F --> G
    G --> H{User Action}
    H -->|Close| I[Return to Game]
    H -->|Share Rank| J[Open Share Dialog]
```

### Description
Leaderboard provides competitive element and social proof, encouraging continued engagement and improvement.

### Leaderboard Features
- Global top 100 display
- User's rank highlighted
- Nearby competitors shown
- Refresh every 15 minutes
- Share ranking capability

### Ranking Algorithm
```
Score = (Correct Answers * 100) + (Accuracy % * 10) + (Streak Bonus * 5)
```

---

## Flow 9: Image Loading & Prefetch

```mermaid
graph TD
    A[Game State] --> B{Current Image Loaded?}
    B -->|No| C[Show Skeleton]
    B -->|Yes| D[Display Image]
    C --> E[Fetch Current Image]
    E --> D
    D --> F[User Viewing]
    F --> G[Prefetch Next Image]
    G --> H[Cache in Memory]
    H --> I[User Clicks Next]
    I --> J[Instant Display]
```

### Description
Optimized image loading strategy ensures smooth gameplay with no waiting between rounds.

### Loading Strategy
1. **Priority Loading**: Current image first
2. **Prefetching**: Next image during result viewing
3. **Caching**: Keep last 5 images in memory
4. **Progressive Enhancement**: Show low-res first, then high-res
5. **Fallback**: Generic placeholder if load fails

### Performance Targets
- Initial image load: <1 second
- Subsequent images: Instant (prefetched)
- Skeleton display: Immediate
- Error handling: Automatic retry with exponential backoff

---

## Flow 10: Tutorial for New Users

```mermaid
graph TD
    A[First Visit Detected] --> B{Show Tutorial?}
    B -->|Yes| C[Overlay Tutorial]
    B -->|No| D[Start Game]
    C --> E[Explain AI vs Real]
    E --> F[Show Swipe Gestures]
    F --> G[Explain Scoring]
    G --> H[Start First Game]
    H --> D
```

### Description
Optional tutorial for first-time users to understand game mechanics and improve engagement.

### Tutorial Steps
1. **Welcome**: Brief explanation of the game
2. **How to Play**: Show AI vs Real examples
3. **Controls**: Demonstrate swipe gestures (mobile) or buttons
4. **Scoring**: Explain points and streaks
5. **Start Playing**: Jump into first image

### Skip Options
- "Skip Tutorial" button always visible
- Auto-dismiss after 30 seconds
- Don't show again checkbox
- Accessible from help menu later