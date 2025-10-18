# Monetag Ad Integration Setup Guide

## Overview

This guide walks you through setting up Monetag ads for the "AI or Not?" game to generate revenue through banner advertisements.

## Step 1: Create Monetag Account

1. Visit [Monetag](https://monetag.com/) (formerly PropellerAds)
2. Click "Sign Up" and create a publisher account
3. Complete the registration process and verify your email
4. Log in to your Monetag dashboard

## Step 2: Add Your Website

1. In the Monetag dashboard, go to **"Websites"**
2. Click **"Add Website"**
3. Enter your website details:
   - **Website URL**: Your production domain (e.g., `https://aiornot.game`)
   - **Category**: Entertainment / Games
   - **Traffic Type**: Desktop & Mobile
4. Submit for approval (typically takes 24-48 hours)

## Step 3: Create Ad Zones

Once your website is approved, create 4 ad zones for different positions:

### Desktop Ad Zones

#### Top Banner (728x90 Leaderboard)
1. Go to **"Ad Zones"** → **"Create New Zone"**
2. Settings:
   - **Zone Type**: Banner
   - **Size**: 728x90 (Leaderboard)
   - **Position**: Top of page
   - **Name**: "AI or Not - Top Banner"
3. Copy the zone code/ID

#### Bottom Banner (728x90 Leaderboard)
1. Create another zone with:
   - **Size**: 728x90 (Leaderboard)
   - **Position**: Bottom of page
   - **Name**: "AI or Not - Bottom Banner"
2. Copy the zone code/ID

#### Left Sidebar (160x600 Skyscraper)
1. Create a zone with:
   - **Size**: 160x600 (Wide Skyscraper)
   - **Position**: Left sidebar
   - **Name**: "AI or Not - Left Sidebar"
2. Copy the zone code/ID

#### Right Sidebar (160x600 Skyscraper)
1. Create a zone with:
   - **Size**: 160x600 (Wide Skyscraper)
   - **Position**: Right sidebar
   - **Name**: "AI or Not - Right Sidebar"
2. Copy the zone code/ID

### Mobile Ad Zones

For mobile devices, Monetag will automatically serve 320x50 mobile banners in place of desktop sizes.

## Step 4: Configure Environment Variables

1. Copy the ad zone codes from your Monetag dashboard
2. Add them to your `.env.local` file:

```bash
# Monetag Ad Codes
NEXT_PUBLIC_MONETAG_TOP_AD="your_top_ad_zone_code"
NEXT_PUBLIC_MONETAG_BOTTOM_AD="your_bottom_ad_zone_code"
NEXT_PUBLIC_MONETAG_LEFT_AD="your_left_ad_zone_code"
NEXT_PUBLIC_MONETAG_RIGHT_AD="your_right_ad_zone_code"
```

3. For production, add these to your hosting environment variables (Vercel/Bluehost)

## Step 5: Verify Integration

1. Start your development server: `npm run dev`
2. Open the game in your browser
3. You should see ad placeholders or test ads (in development)
4. Open browser DevTools → Network tab
5. Verify Monetag scripts are loading

## Step 6: Testing in Production

1. Deploy to production
2. Visit your live site
3. Ads should appear in all 4 positions (desktop) or 2 positions (mobile)
4. Check Monetag dashboard for impressions (may take 1-2 hours to update)

## Ad Positions Summary

### Desktop Layout
```
┌─────────────────────────────────────┐
│         TOP BANNER (728x90)         │
├──────┬──────────────────────┬───────┤
│ LEFT │                      │ RIGHT │
│ AD   │   GAME CONTENT       │  AD   │
│160x  │                      │160x   │
│600   │                      │600    │
├──────┴──────────────────────┴───────┤
│       BOTTOM BANNER (728x90)        │
└─────────────────────────────────────┘
```

### Mobile Layout
```
┌──────────────────────┐
│ TOP BANNER (320x50)  │
├──────────────────────┤
│                      │
│   GAME CONTENT       │
│                      │
├──────────────────────┤
│ BOTTOM BANNER        │
│     (320x50)         │
└──────────────────────┘
```

## Revenue Optimization Tips

1. **Ad Placement**: Keep ads visible but not intrusive
2. **Ad Refresh**: Ads refresh when user navigates (built-in)
3. **Ad Blocker Handling**: Polite message shown to users with ad blockers
4. **Mobile Optimization**: Responsive ads for mobile users
5. **Performance**: Ads load asynchronously to not block page rendering

## Monitoring Performance

### In Monetag Dashboard
- **Impressions**: Number of times ads were displayed
- **Clicks**: Number of ad clicks
- **CTR**: Click-through rate (higher is better)
- **eCPM**: Effective cost per thousand impressions
- **Revenue**: Total earnings

### Expected Revenue (Estimates)
- **1,000 daily visitors**: $5-15/day
- **10,000 daily visitors**: $50-150/day
- **100,000 daily visitors**: $500-1500/day

*Actual revenue depends on traffic quality, geography, and user engagement.*

## Troubleshooting

### Ads Not Showing
1. Check environment variables are set correctly
2. Verify Monetag account is approved
3. Check browser console for errors
4. Ensure ad zone codes are active in Monetag dashboard
5. Clear browser cache and reload

### Low Revenue
1. Check ad placement visibility
2. Verify mobile responsiveness
3. Monitor CTR in Monetag dashboard
4. Test different ad positions (A/B testing)
5. Ensure traffic is legitimate (no bots)

### Ad Blocker Issues
- Component already handles ad blocker detection
- Shows polite message to users
- Doesn't break the user experience

## Compliance

### Important Notes
1. **Privacy Policy**: Update your privacy policy to mention ads
2. **Cookie Consent**: May need GDPR/CCPA cookie consent (if EU/CA traffic)
3. **Content Policy**: Ensure game content complies with Monetag policies
4. **Ad Fraud**: Use Monetag's fraud protection features

## Next Steps

After successful integration:
1. Monitor performance for 1 week
2. A/B test different ad positions
3. Optimize based on revenue data
4. Consider additional ad networks for comparison
5. Implement header bidding for higher revenue (advanced)

## Support

- **Monetag Support**: support@monetag.com
- **Documentation**: https://monetag.com/docs
- **FAQ**: Check Monetag dashboard help section

---

**Status**: Ready for implementation
**Last Updated**: October 18, 2025

