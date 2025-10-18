# Deployment Guide

## Overview

This guide covers deploying the "AI or Not?" game to production environments. The application can be deployed to various platforms including Vercel, Netlify, or traditional hosting services like Bluehost.

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database (production)
- Domain name configured
- SSL certificate
- Environment variables configured

---

## Option 1: Vercel Deployment (Recommended)

### Why Vercel?
- Optimized for Next.js
- Automatic SSL
- Global CDN
- Zero configuration
- Free tier available

### Steps

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   # From project root
   vercel
   
   # For production
   vercel --prod
   ```

4. **Configure Environment Variables**
   - Go to Vercel Dashboard → Project → Settings → Environment Variables
   - Add all variables from `.env.local`:
     ```
     DATABASE_URL=your_production_database_url
     UNSPLASH_ACCESS_KEY=your_key
     PEXELS_API_KEY=your_key
     NEXT_PUBLIC_MONETAG_TOP_AD=your_ad_code
     # ... etc
     ```

5. **Configure Custom Domain**
   - Go to Project Settings → Domains
   - Add your custom domain (e.g., `aiornot.game`)
   - Follow DNS configuration instructions

### Automatic Deployments

Vercel automatically deploys:
- **Main branch** → Production
- **Other branches** → Preview deployments
- **Pull requests** → Preview deployments

---

## Option 2: Bluehost Deployment

### Prerequisites

- Bluehost shared hosting or VPS
- Node.js support enabled
- Database created

### Steps

1. **Build the Application**
   ```bash
   npm run build
   ```

2. **Create Production Archive**
   ```bash
   # Create deployment package
   tar -czf deploy.tar.gz .next public package.json package-lock.json prisma next.config.ts
   ```

3. **Upload to Bluehost**
   - Use FTP/SFTP to upload files to `/home/username/public_html/`
   - Or use cPanel File Manager

4. **Install Dependencies**
   ```bash
   ssh username@your-server.com
   cd public_html
   npm install --production
   ```

5. **Configure Environment Variables**
   Create `.env.production` file:
   ```bash
   DATABASE_URL="postgresql://user:pass@host:5432/dbname"
   # Add all other environment variables
   ```

6. **Run Database Migrations**
   ```bash
   npx prisma migrate deploy
   ```

7. **Start Application**
   ```bash
   npm start
   # Or use PM2 for process management
   pm2 start npm --name "aiornot" -- start
   pm2 save
   pm2 startup
   ```

8. **Configure Web Server (Apache/Nginx)**
   
   **Apache (.htaccess)**:
   ```apache
   RewriteEngine On
   RewriteRule ^$ http://127.0.0.1:3005/ [P,L]
   RewriteCond %{REQUEST_FILENAME} !-f
   RewriteCond %{REQUEST_FILENAME} !-d
   RewriteRule ^(.*)$ http://127.0.0.1:3005/$1 [P,L]
   ```

   **Nginx**:
   ```nginx
   server {
       listen 80;
       server_name aiornot.game;
       
       location / {
           proxy_pass http://localhost:3005;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

---

## Option 3: Docker Deployment

### Dockerfile

Create `Dockerfile` in project root:

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build application
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

USER nextjs

EXPOSE 3005

ENV PORT 3005

CMD ["node", "server.js"]
```

### Docker Compose

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3005:3005"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/aiornot
      - UNSPLASH_ACCESS_KEY=${UNSPLASH_ACCESS_KEY}
      - PEXELS_API_KEY=${PEXELS_API_KEY}
    depends_on:
      - db
    restart: unless-stopped

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=aiornot
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

volumes:
  postgres_data:
```

### Deploy

```bash
# Build and run
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

---

## Database Setup

### Production Database Options

1. **Supabase** (Recommended)
   - Free tier: 500MB database
   - Automatic backups
   - Connection pooling
   - https://supabase.com

2. **Railway**
   - $5/month
   - PostgreSQL 16
   - https://railway.app

3. **Neon**
   - Serverless PostgreSQL
   - Free tier available
   - https://neon.tech

### Database Migration

```bash
# Run migrations in production
npx prisma migrate deploy

# Seed database (if needed)
npx prisma db seed
```

### Backups

```bash
# Create backup
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql

# Restore backup
psql $DATABASE_URL < backup_20251018.sql
```

---

## SSL/HTTPS Setup

### Using Let's Encrypt (Free)

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d aiornot.game -d www.aiornot.game

# Auto-renewal (runs automatically)
sudo certbot renew --dry-run
```

### Using Cloudflare (Recommended)

1. Add domain to Cloudflare
2. Update nameservers
3. Enable "Full (strict)" SSL mode
4. Turn on "Always Use HTTPS"

**Benefits**:
- Free SSL certificate
- DDoS protection
- CDN caching
- Analytics

---

## Environment Variables

### Production Checklist

```env
# Database
DATABASE_URL="postgresql://..."

# Image APIs
UNSPLASH_ACCESS_KEY="production_key"
PEXELS_API_KEY="production_key"
REPLICATE_API_TOKEN="production_token"
LEONARDO_API_KEY="production_key"

# Monetag Ads
NEXT_PUBLIC_MONETAG_TOP_AD="actual_ad_code"
NEXT_PUBLIC_MONETAG_BOTTOM_AD="actual_ad_code"
NEXT_PUBLIC_MONETAG_LEFT_AD="actual_ad_code"
NEXT_PUBLIC_MONETAG_RIGHT_AD="actual_ad_code"

# Sentry (Error Tracking)
NEXT_PUBLIC_SENTRY_DSN="your_sentry_dsn"
SENTRY_AUTH_TOKEN="your_auth_token"
SENTRY_ORG="your_org"
SENTRY_PROJECT="your_project"

# App Config
NODE_ENV="production"
NEXT_PUBLIC_APP_URL="https://aiornot.game"
```

---

## Performance Optimization

### 1. Enable Caching

```javascript
// next.config.ts
export default {
  headers: async () => [
    {
      source: '/:all*(svg|jpg|png|webp)',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
  ],
}
```

### 2. Enable Compression

```bash
# Add to nginx config
gzip on;
gzip_types text/plain text/css application/json application/javascript;
```

### 3. Database Connection Pooling

Already configured in Prisma with connection pooling.

---

## Monitoring & Analytics

### Sentry Setup (Error Tracking)

```bash
# Install Sentry
npm install @sentry/nextjs

# Initialize
npx @sentry/wizard@latest -i nextjs
```

### Google Analytics

Add to `src/app/layout.tsx`:

```javascript
<Script
  src={`https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX`}
  strategy="afterInteractive"
/>
<Script id="google-analytics" strategy="afterInteractive">
  {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXXXXX');
  `}
</Script>
```

---

## Pre-Launch Checklist

### Technical
- [ ] All environment variables configured
- [ ] Database migrations run
- [ ] SSL certificate installed
- [ ] Domain DNS configured
- [ ] Backups configured
- [ ] Error tracking enabled
- [ ] Analytics installed

### Content
- [ ] Images populated in database (100+)
- [ ] Test game flow end-to-end
- [ ] Mobile testing complete
- [ ] Cross-browser testing done

### SEO
- [ ] Meta tags configured
- [ ] Open Graph images set
- [ ] Sitemap generated
- [ ] robots.txt configured

### Legal
- [ ] Privacy policy published
- [ ] Terms of service published
- [ ] Cookie consent (if EU traffic)

---

## Post-Launch Tasks

### Day 1
- Monitor error rates
- Check analytics
- Test from different locations
- Verify ad impressions

### Week 1
- Review user feedback
- Check performance metrics
- Monitor database performance
- Optimize based on data

### Month 1
- A/B test ad placements
- Expand image database
- Review revenue metrics
- Plan feature updates

---

## Troubleshooting

### Common Issues

**Build Failures**
```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

**Database Connection Errors**
- Check DATABASE_URL format
- Verify network access
- Check connection limits

**Image Loading Issues**
- Verify API keys are active
- Check CORS configuration
- Monitor API rate limits

**Performance Issues**
- Enable caching
- Optimize images
- Use CDN
- Database indexing

---

## Rollback Procedure

If deployment fails:

1. **Vercel**: Revert to previous deployment in dashboard
2. **Docker**: `docker-compose down && git checkout previous-tag && docker-compose up -d`
3. **Traditional**: Restore from backup

---

## Support & Resources

- **Next.js Deployment**: https://nextjs.org/docs/deployment
- **Vercel Docs**: https://vercel.com/docs
- **Prisma Deployment**: https://www.prisma.io/docs/guides/deployment
- **Docker Best Practices**: https://docs.docker.com/develop/dev-best-practices/

---

**Last Updated**: October 18, 2025

