# Technical Stack & Architecture

## Frontend Stack

### Core Framework
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Runtime**: Node.js 18+

### Styling & UI
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Animations**: Framer Motion
- **Icons**: Lucide React

### State Management
- **Phase 1**: React Context + useState/useReducer
- **Phase 2**: Redux Toolkit (when complexity increases)

### User Interaction
- **Gesture Detection**: react-swipeable
- **Social Sharing**: react-share
- **Image Handling**: next/image with optimization

## Backend Stack

### API Layer
- **API Routes**: Next.js API Routes
- **Validation**: Zod
- **Rate Limiting**: upstash/ratelimit

### Database
- **Primary Database**: PostgreSQL (via Supabase or PlanetScale)
- **ORM**: Prisma
- **Caching**: Redis (via Upstash)

### File Storage & CDN
- **Image CDN**: Cloudinary or Next.js Image Optimization
- **Static Assets**: Vercel Edge Network

## External Services

### Image Sources
#### Real Images
- **Primary**: Unsplash API
- **Secondary**: Pexels API
- **Tertiary**: Pixabay API

#### AI Images
- **Primary**: Replicate API (DALL-E, Stable Diffusion, Midjourney-style)
- **Secondary**: Leonardo.ai API
- **Experimental**: Hugging Face API

### Analytics & Monitoring
- **Analytics**: Vercel Analytics
- **Error Tracking**: Sentry
- **Performance Monitoring**: Web Vitals

### Monetization
- **Primary Ad Network**: Google AdSense
- **Backup Ad Network**: Media.net
- **Ad Management**: Custom React components with lazy loading

## Infrastructure

### Hosting & Deployment
- **Platform**: Vercel (optimized for Next.js)
- **CDN**: Vercel Edge Network
- **Domain & DNS**: Cloudflare

### Environment Management
- **Development**: Local with hot reload
- **Staging**: Vercel Preview Deployments
- **Production**: Vercel Production

## Development Tools

### Version Control
- **VCS**: Git
- **Repository**: GitHub
- **Branching Strategy**: Git Flow

### CI/CD Pipeline
- **CI**: GitHub Actions
- **CD**: Vercel Auto-deployment
- **Preview**: Automatic preview deployments for PRs

### Code Quality
- **Linting**: ESLint with Next.js config
- **Formatting**: Prettier
- **Git Hooks**: Husky with lint-staged
- **Type Checking**: TypeScript strict mode

### Testing
- **Unit Testing**: Jest
- **Component Testing**: React Testing Library
- **E2E Testing**: Playwright
- **API Testing**: Supertest

## Architecture Patterns

### Application Architecture
```
┌─────────────────────────────────────────────────────────┐
│                     Client Browser                       │
│  ┌─────────────────────────────────────────────────┐   │
│  │            Next.js React Application             │   │
│  │  ┌───────────┐  ┌──────────┐  ┌──────────┐    │   │
│  │  │   Pages   │  │Components│  │   Hooks   │    │   │
│  │  └───────────┘  └──────────┘  └──────────┘    │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                   Next.js API Routes                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐     │
│  │   Auth   │  │   Game   │  │   Image Service   │     │
│  └──────────┘  └──────────┘  └──────────────────┘     │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                    Data Layer                            │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐     │
│  │PostgreSQL│  │  Redis   │  │  External APIs   │     │
│  └──────────┘  └──────────┘  └──────────────────┘     │
└─────────────────────────────────────────────────────────┘
```

### Data Flow
```
User Action → React Component → API Route → Database
                    ↓
             State Update → UI Re-render
```

### Caching Strategy

| Content Type | Cache Duration | Cache Location |
|-------------|---------------|----------------|
| Image Metadata | 24 hours | Redis + Browser |
| Vote Statistics | 5 minutes | Redis |
| Leaderboard | 15 minutes | Redis |
| Static Assets | Permanent | CDN + Browser |
| API Responses | Variable | Redis + HTTP Cache |

## Security Considerations

### Frontend Security
- Content Security Policy (CSP) headers
- XSS protection via React's built-in escaping
- HTTPS enforcement
- Secure cookie configuration

### Backend Security
- Input validation with Zod
- SQL injection prevention via Prisma
- Rate limiting on all endpoints
- API key rotation for external services
- Environment variable protection

### Data Privacy
- No personal data collection without consent
- Anonymous user IDs for scoring
- GDPR compliance for EU users
- Cookie consent for advertising

## Performance Targets

### Core Web Vitals
- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1

### Application Metrics
- **Time to Interactive**: < 3s
- **Image Load Time**: < 1s (with lazy loading)
- **API Response Time**: < 200ms (p95)
- **Database Query Time**: < 50ms (p95)

## Scalability Considerations

### Horizontal Scaling
- Stateless API design
- Database connection pooling
- CDN for static assets
- Edge functions for global distribution

### Vertical Scaling
- Database indexing optimization
- Query optimization with Prisma
- Redis caching for hot data
- Image optimization and compression

### Load Handling
- **Expected Load**: 1000 DAU initially
- **Target Capacity**: 10,000 concurrent users
- **Scaling Strategy**: Auto-scaling with Vercel
- **Database Scaling**: PlanetScale or Supabase auto-scaling

## Development Workflow

### Local Development
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

### Deployment Pipeline
1. Push to feature branch
2. Automated tests run via GitHub Actions
3. Preview deployment created on Vercel
4. Code review and approval
5. Merge to main branch
6. Automatic production deployment

### Environment Variables
```env
# Database
DATABASE_URL=
REDIS_URL=

# External APIs
UNSPLASH_ACCESS_KEY=
PEXELS_API_KEY=
REPLICATE_API_TOKEN=
LEONARDO_API_KEY=

# Analytics
SENTRY_DSN=
VERCEL_ANALYTICS_ID=

# Advertising
ADSENSE_CLIENT_ID=

# Application
NEXT_PUBLIC_BASE_URL=
```