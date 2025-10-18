# AI or Not? - The Ultimate Image Detection Game

## Overview

**AI or Not?** is an engaging web-based game that challenges users to distinguish between real photographs and AI-generated images. As artificial intelligence image generation becomes increasingly sophisticated, this platform serves both as entertainment and education, helping users develop critical skills in identifying synthetic media.

## Key Features

### Core Gameplay

- **Binary Choice System**: Simple "AI" or "Not AI" decision for each image
- **Instant Feedback**: Immediate results showing correct answer and community statistics
- **Continuous Play**: Seamless progression without page reloads
- **Dynamic Content**: Infinite rotation of images fetched from multiple sources

### Gamification

- **Persistent Scoring**: Track your accuracy and improvement over time
- **Global Leaderboard**: Compete with players worldwide
- **Streak Tracking**: Build consecutive correct answer streaks
- **Social Sharing**: Share results and challenge friends on social media

### Mobile Experience

- **Responsive Design**: Optimized for all screen sizes
- **Swipe Gestures**: Dating app-style swiping (right for AI, left for Real)
- **Touch-Optimized**: Large, thumb-friendly interaction areas

### Monetization

- **Strategic Ad Placement**: 4 non-intrusive banner positions
- **High-Quality Ad Networks**: Premium display advertising
- **User-Friendly**: Ads that don't disrupt gameplay

## Documentation

Comprehensive documentation is available in the `/docs` directory:

- **[Product Requirements Document (PRD)](./docs/PRD.md)**: Complete product specification and requirements
- **[Technical Stack](./docs/TECH_STACK.md)**: Detailed technology choices and architecture
- **[User Stories](./docs/USER_STORIES.md)**: Feature requirements from user perspective
- **[User Flows](./docs/USER_FLOWS.md)**: Detailed interaction flows and diagrams
- **[Implementation Plan](./docs/IMPLEMENTATION_PLAN.md)**: Phased development roadmap
- **[API Research](./docs/API_RESEARCH.md)**: Comprehensive analysis of image API options

## Tech Stack

### Frontend

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: React Context (Phase 1), Redux Toolkit (Phase 2)
- **Animations**: Framer Motion

### Backend

- **API**: Next.js API Routes
- **Database**: PostgreSQL (Supabase/PlanetScale)
- **ORM**: Prisma
- **Caching**: Redis (Upstash)

### External Services

- **Real Images**: Unsplash API, Pexels API
- **AI Images**: Midjourney public gallery, Stability AI gallery API, Replicate API, Leonardo.ai
- **Analytics**: Vercel Analytics
- **Hosting**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- PostgreSQL database (or Supabase account)
- API keys for image services

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/ai-or-not.git
cd ai-or-not
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your API keys:

```env
DATABASE_URL=your_database_url
UNSPLASH_ACCESS_KEY=your_unsplash_key
PEXELS_API_KEY=your_pexels_key
REPLICATE_API_TOKEN=your_replicate_token
LEONARDO_API_KEY=your_leonardo_key
STABILITY_API_KEY=your_stability_gallery_key
```

Midjourney community images are sourced directly from the public Explore feed, so no API key is required.

4. Run database migrations:

```bash
npx prisma migrate dev
```

5. Start the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Development

### Project Structure

```
├── src/
│   ├── app/           # Next.js app router pages
│   ├── components/    # React components
│   ├── lib/          # Utility functions and libraries
│   ├── hooks/        # Custom React hooks
│   ├── services/     # API and external service integrations
│   └── styles/       # Global styles
├── prisma/           # Database schema and migrations
├── public/           # Static assets
├── docs/            # Project documentation
└── tests/           # Test files
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run tests
- `npm run db:push` - Push database schema changes
- `npm run db:studio` - Open Prisma Studio

## Database & Prisma

- The app uses PostgreSQL via the `DATABASE_URL` in environment variables. Prisma models are defined in `prisma/schema.prisma`.
- Prisma Client is created once in `src/lib/prisma.ts` and reused across requests.
- Tables include `Image`, `Vote`, `User`, `Stat`, `Leaderboard`, and `ViewedImage` for per-session viewed tracking.
- Regenerate client after schema changes:

```bash
npx prisma generate
```

- Run migrations against your database:

```bash
npx prisma migrate deploy
```

### Viewed images tracking

- Per-session views are stored in `ViewedImage` with a unique `(sessionId, imageId)`.
- `DatabaseService.markImageAsViewed` uses `upsert` to record views.
- `DatabaseService.getRandomImage` selects unviewed images when a `x-session-id` header is provided.
- If all images are viewed, a throttle guard (5 minutes) prevents repeated repopulations.

## Image sources and domains

- Real images are fetched from Unsplash, then Pexels, then Picsum fallback when keys are missing or responses are non-OK.
- AI images are fetched from Midjourney Explore and Stability AI gallery (if `STABILITY_API_KEY` is set), then placeholders (Replicate/Leonardo) and in-memory mocks as last resort.
- Non-OK responses (403/404, etc.) are treated as soft failures and skipped; fallbacks supply images.
- Remote domains allowed in `next.config.ts`:
  - `images.unsplash.com`, `images.pexels.com`, `picsum.photos`, `cdn.midjourney.com`, `mage.space`, `*.mage.space`, `replicate.delivery`, `pbxt.replicate.delivery`.

### Environment variables

- `DATABASE_URL` (Postgres)
- `UNSPLASH_ACCESS_KEY` or `NEXT_PUBLIC_UNSPLASH_ACCESS_KEY` (optional)
- `PEXELS_API_KEY` (optional)
- `STABILITY_API_KEY` or `STABILITY_API_TOKEN` (optional)
- `REPLICATE_API_TOKEN`, `LEONARDO_API_KEY` (optional)

## Testing

- API smoke test:

```bash
curl -s http://localhost:3005/api/images/random -H 'x-session-id: test-session-1'
```

- Unit tests:

```bash
node --test tests/imageSelection.test.cjs
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Configure environment variables
4. Deploy

The application will automatically deploy on push to the main branch.

### Manual Deployment

1. Build the application:

```bash
npm run build
```

2. Start the production server:

```bash
npm start
```

## Implementation Phases

### Phase 1: Foundation & MVP (Weeks 1-2)

- Basic game interface
- Static data flow
- Mobile responsiveness

### Phase 2: Backend Integration (Weeks 3-4)

- Database setup
- API development
- External image integration

### Phase 3: Advanced Features (Weeks 5-6)

- Statistics and analytics
- Leaderboard system
- Social sharing

### Phase 4: Monetization & Polish (Weeks 7-8)

- Ad integration
- Enhanced UX
- Testing and QA

### Phase 5: Post-Launch (Week 9+)

- Monitoring and optimization
- Feature expansion
- Scaling

## Performance Targets

- **Page Load**: < 2 seconds
- **Image Load**: < 1 second
- **API Response**: < 200ms (p95)
- **Error Rate**: < 1%
- **Uptime**: > 99.5%

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@aiornot.game or open an issue in the GitHub repository.

## Acknowledgments

- [Next.js](https://nextjs.org) - The React framework
- [Vercel](https://vercel.com) - Hosting and deployment
- [shadcn/ui](https://ui.shadcn.com) - UI components
- [Unsplash](https://unsplash.com) - Real photography
- [Replicate](https://replicate.com) - AI image access

---

Built with passion for the intersection of AI and human perception. Can you tell the difference?
