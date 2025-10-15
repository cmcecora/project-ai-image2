# AI or Not? - Phase 1 Implementation Brief

## Project Overview
**AI or Not?** is a web game where users distinguish between real photos and AI-generated images. Players make binary choices (AI/Not AI), receive instant feedback with community statistics, and track their scores on a leaderboard.

## Core Requirements
- **Gameplay**: Display image → User chooses AI/Not AI → Show results with stats → Next image
- **Mobile**: Swipe gestures (right=AI, left=Real) + responsive design
- **Persistence**: LocalStorage for scores, leaderboard feature
- **Monetization**: 4 banner ad placements (top, bottom, left, right)
- **Social**: Share results on social media
- **Performance**: No page reloads, <2s load time, smooth transitions

## Tech Stack for Phase 1
- **Framework**: Next.js 14 (App Router) with TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **State**: React Context + useState (upgrade to Redux in Phase 2)
- **Gestures**: react-swipeable for mobile swipes
- **Animations**: Framer Motion for transitions

## Phase 1: Foundation & MVP (Week 1-2)

### Sprint 1.1: Project Setup & Core UI (3 days)
**Tasks:**
- [ ] Initialize Next.js with TypeScript
- [ ] Set up Tailwind CSS and shadcn/ui
- [ ] Configure ESLint and Prettier
- [ ] Create basic folder structure:
  ```
  src/
    app/           # Next.js pages
    components/    # React components
    lib/          # Utilities
    hooks/        # Custom hooks
    services/     # API integrations
    types/        # TypeScript types
  ```
- [ ] Set up Git repository
- [ ] Install dependencies: `react-swipeable`, `framer-motion`

**Setup Commands:**
```bash
# Install shadcn/ui
npx shadcn-ui@latest init

# Install required packages
npm install react-swipeable framer-motion clsx tailwind-merge

# Install dev dependencies
npm install -D @types/node eslint prettier
```

### Sprint 1.2: Basic Game Interface (4 days)
**Components to Build:**
1. **GameLayout** - Main container with ad placeholders
2. **ImageDisplay** - Central image with loading states
3. **ChoiceButtons** - AI/Not AI buttons with hover states
4. **QuestionHeader** - "Is this photo AI?" text
5. **ScoreDisplay** - Current score/streak tracker

**Key Files:**
```typescript
// src/types/game.ts
export interface GameImage {
  id: string;
  url: string;
  isAI: boolean;
  source: string;
  credits?: string;
}

export interface GameState {
  currentImage: GameImage | null;
  score: number;
  totalPlayed: number;
  streak: number;
  isLoading: boolean;
  showResults: boolean;
}

// src/components/game/GameContainer.tsx
// Main game component with state management

// src/components/game/ImageCard.tsx
// Image display with skeleton loading

// src/components/game/ChoiceButtons.tsx
// AI/Not AI button components
```

### Sprint 1.3: Static Data Flow (3 days)
**Mock Data Structure:**
```typescript
// src/data/mockImages.ts
export const mockImages: GameImage[] = [
  {
    id: '1',
    url: 'https://images.unsplash.com/photo-xxxxx',
    isAI: false,
    source: 'Unsplash',
    credits: 'Photo by John Doe'
  },
  {
    id: '2',
    url: '/mock/ai-image-1.jpg',
    isAI: true,
    source: 'DALL-E 2',
    credits: 'AI Generated'
  },
  // ... 20+ mock images
];
```

**Game Logic Implementation:**
- Handle user choice (correct/incorrect)
- Show results overlay with:
  - ✓/✗ indicator
  - "82% thought this was AI" (mock data)
  - Image source and credits
  - Updated score
- "Next" button to continue
- Smooth transitions with Framer Motion

### Sprint 1.4: Mobile Optimization (2 days)
**Swipe Implementation:**
```typescript
// src/hooks/useSwipeGesture.ts
import { useSwipeable } from 'react-swipeable';

export const useGameSwipe = (onAI: () => void, onNotAI: () => void) => {
  return useSwipeable({
    onSwipedRight: onAI,
    onSwipedLeft: onNotAI,
    trackMouse: false,
    delta: 50, // minimum swipe distance
  });
};
```

**Responsive Breakpoints:**
- Mobile: < 640px (single column, ads top/bottom only)
- Tablet: 640px - 1024px
- Desktop: > 1024px (4 ad placements)

## File Structure for Phase 1
```
src/
├── app/
│   ├── layout.tsx         # Root layout with meta tags
│   ├── page.tsx           # Home page with game
│   └── globals.css        # Global styles
├── components/
│   ├── game/
│   │   ├── GameContainer.tsx
│   │   ├── ImageCard.tsx
│   │   ├── ChoiceButtons.tsx
│   │   ├── ResultsOverlay.tsx
│   │   └── ScoreDisplay.tsx
│   ├── ui/              # shadcn components
│   └── layout/
│       ├── Header.tsx
│       └── AdPlaceholder.tsx
├── hooks/
│   ├── useGameState.ts
│   ├── useSwipeGesture.ts
│   └── useLocalStorage.ts
├── lib/
│   └── utils.ts         # Utility functions
├── data/
│   └── mockImages.ts    # Static mock data
└── types/
    └── game.ts          # TypeScript interfaces

```

## Phase 1 Success Criteria
- ✅ Functional game loop with mock data
- ✅ Mobile responsive with swipe gestures
- ✅ Score tracking in React state
- ✅ Smooth transitions between game states
- ✅ <2 second initial load time
- ✅ Ad placement containers ready
- ✅ LocalStorage score persistence

## Key Implementation Notes

### State Management (Phase 1 - React Context)
```typescript
// src/context/GameContext.tsx
const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>(initialState);
  // Game logic here
  return (
    <GameContext.Provider value={{ gameState, actions }}>
      {children}
    </GameContext.Provider>
  );
};
```

### LocalStorage Hook
```typescript
// src/hooks/useLocalStorage.ts
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });
  // ... setter logic
}
```

## Next Steps After Phase 1
Once Phase 1 is complete and functional with mock data:
- **Phase 2**: Integrate real APIs (Unsplash, Replicate), add database
- **Phase 3**: Implement leaderboard, statistics, social sharing
- **Phase 4**: Add monetization with actual ads, polish UX
- **Phase 5**: Launch and iterate based on user feedback

## Quick Start Commands
```bash
# Start development
npm run dev

# Build for production
npm run build

# Run production build
npm run start

# Type checking
npm run type-check

# Linting
npm run lint
```

---

**This brief contains everything needed to start Phase 1 implementation. Focus on getting the core game loop working with static data first, then iterate from there.**