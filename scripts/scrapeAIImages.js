// scripts/scrapeAIImages.js
/**
 * AI Image Scraper for Midjourney and Mage.space
 *
 * This script automatically scrapes AI-generated images from public galleries:
 * - Midjourney Explore: https://www.midjourney.com/explore
 * - Mage.space Explore: https://www.mage.space/explore
 *
 * Features:
 * - Automatically scrolls to load more images
 * - Detects and skips duplicate images (checks URL in database)
 * - Saves images with proper metadata (source, model, credits)
 * - Can be run multiple times - only saves new images
 *
 * Usage:
 *   npm run scrape-ai-images
 *
 * The script will:
 * 1. Launch a headless browser
 * 2. Visit each explore page
 * 3. Scroll to discover images (up to 25 per source)
 * 4. Extract image URLs from the page source
 * 5. Save to database, skipping any URLs that already exist
 *
 * Each run fetches fresh images from the current gallery state.
 * Running it multiple times will gradually build your AI image collection.
 */

import { chromium } from 'playwright';
import { PrismaClient } from '../src/generated/prisma/index.js';

const prisma = new PrismaClient();

/**
 * Scrape images from Midjourney Explore page
 */
async function scrapeMidjourneyImages(page, count = 50) {
  console.log('🎨 Scraping Midjourney Explore...');

  try {
    await page.goto('https://www.midjourney.com/explore', {
      waitUntil: 'networkidle',
      timeout: 60000,
    });

    // Wait for images to load
    await page.waitForTimeout(3000);

    const images = new Set();
    let scrollAttempts = 0;
    const maxScrollAttempts = 20;

    while (images.size < count && scrollAttempts < maxScrollAttempts) {
      // Extract image URLs from the page
      const newImages = await page.evaluate(() => {
        const urls = [];

        // Look for image elements
        const imgElements = document.querySelectorAll('img[src*="cdn.midjourney.com"]');
        imgElements.forEach(img => {
          const src = img.src;
          if (src && src.includes('cdn.midjourney.com')) {
            // Remove query parameters to get clean URL
            const cleanUrl = src.split('?')[0];
            // Support various image formats
            if (cleanUrl.match(/\.(jpg|jpeg|png|gif|webp|avif)$/i)) {
              urls.push(cleanUrl);
            }
          }
        });

        // Also check for background images in div elements
        const divElements = document.querySelectorAll('div[style*="background-image"]');
        divElements.forEach(div => {
          const style = div.getAttribute('style');
          const match = style.match(/url\(['"]?(https:\/\/cdn\.midjourney\.com[^'")\s]+)/);
          if (match) {
            const cleanUrl = match[1].split('?')[0];
            // Support various image formats
            if (cleanUrl.match(/\.(jpg|jpeg|png|gif|webp|avif)$/i)) {
              urls.push(cleanUrl);
            }
          }
        });

        return urls;
      });

      // Add new images to set
      newImages.forEach(url => images.add(url));

      console.log(`  Found ${images.size} unique images so far...`);

      if (images.size >= count) break;

      // Scroll down to load more images
      await page.evaluate(() => {
        window.scrollBy(0, window.innerHeight);
      });

      await page.waitForTimeout(2000);
      scrollAttempts++;
    }

    const imageArray = Array.from(images).slice(0, count);
    console.log(`✅ Scraped ${imageArray.length} images from Midjourney\n`);

    return imageArray.map(url => {
      const isVideo = /\.(mp4|webm|ogg|mov|avi|mkv|m4v)$/i.test(url)
      return {
        url,
        source: 'Midjourney',
        model: 'Midjourney',
        credits: 'Image from Midjourney community gallery',
        mediaType: isVideo ? 'video' : 'image',
      }
    });
  } catch (error) {
    console.error('❌ Error scraping Midjourney:', error.message);
    return [];
  }
}

/**
 * Scrape images from Mage.space Explore page
 */
async function scrapeMageSpaceImages(page, count = 50) {
  console.log('🎨 Scraping Mage.space Explore...');

  try {
    await page.goto('https://www.mage.space/explore', {
      waitUntil: 'networkidle',
      timeout: 60000,
    });

    // Wait for images to load
    await page.waitForTimeout(3000);

    const images = new Set();
    let scrollAttempts = 0;
    const maxScrollAttempts = 20;

    while (images.size < count && scrollAttempts < maxScrollAttempts) {
      // Extract image URLs from the page
      const newImages = await page.evaluate(() => {
        const urls = [];

        // Look for image elements - Mage.space typically uses img tags
        const imgElements = document.querySelectorAll('img[src]');
        imgElements.forEach(img => {
          const src = img.src;
          // Filter for actual content images (not icons, logos, etc)
          if (src &&
              !src.includes('logo') &&
              !src.includes('icon') &&
              !src.includes('avatar') &&
              (src.includes('mage.space') ||
               src.includes('firebasestorage') ||
               src.includes('cloudflare') ||
               src.includes('cdn'))) {
            const cleanUrl = src.split('?')[0];
            // Support various image formats
            if (cleanUrl.match(/\.(jpg|jpeg|png|gif|webp|avif)$/i)) {
              urls.push(cleanUrl);
            }
          }
        });

        // Also check for background images
        const divElements = document.querySelectorAll('div[style*="background-image"]');
        divElements.forEach(div => {
          const style = div.getAttribute('style');
          const match = style.match(/url\(['"]?([^'")\s]+)/);
          if (match && match[1].includes('http')) {
            const cleanUrl = match[1].split('?')[0];
            if (!cleanUrl.includes('logo') && !cleanUrl.includes('icon')) {
              // Support various image formats
              if (cleanUrl.match(/\.(jpg|jpeg|png|gif|webp|avif)$/i)) {
                urls.push(cleanUrl);
              }
            }
          }
        });

        return urls;
      });

      // Add new images to set
      newImages.forEach(url => images.add(url));

      console.log(`  Found ${images.size} unique images so far...`);

      if (images.size >= count) break;

      // Scroll down to load more images
      await page.evaluate(() => {
        window.scrollBy(0, window.innerHeight);
      });

      await page.waitForTimeout(2000);
      scrollAttempts++;
    }

    const imageArray = Array.from(images).slice(0, count);
    console.log(`✅ Scraped ${imageArray.length} images from Mage.space\n`);

    return imageArray.map(url => {
      const isVideo = /\.(mp4|webm|ogg|mov|avi|mkv|m4v)$/i.test(url)
      return {
        url,
        source: 'Mage.space',
        model: 'Mage.space AI',
        credits: 'Image from Mage.space community gallery',
        mediaType: isVideo ? 'video' : 'image',
      }
    });
  } catch (error) {
    console.error('❌ Error scraping Mage.space:', error.message);
    return [];
  }
}

/**
 * Save images to database, skipping duplicates
 */
async function saveImagesToDatabase(images) {
  console.log('💾 Saving images to database...\n');

  let savedCount = 0;
  let skippedCount = 0;

  for (const image of images) {
    try {
      // Check if image already exists
      const existing = await prisma.image.findUnique({
        where: { url: image.url },
      });

      if (!existing) {
        await prisma.image.create({
          data: {
            url: image.url,
            source: image.source,
            type: 'ai',
            mediaType: image.mediaType,
            metadata: {
              model: image.model,
              credits: image.credits,
            },
          },
        });
        savedCount++;
        console.log(`  ✓ Saved: ${image.source} - ${image.url.substring(0, 60)}...`);
      } else {
        skippedCount++;
        console.log(`  ⏭️  Skipped (duplicate): ${image.url.substring(0, 60)}...`);
      }
    } catch (error) {
      console.error(`  ❌ Failed to save image: ${error.message}`);
    }
  }

  return { savedCount, skippedCount };
}

/**
 * Main scraping function
 */
async function scrapeAIImages() {
  console.log('🚀 Starting AI image scraping...\n');

  const browser = await chromium.launch({
    headless: true,
  });

  try {
    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    });

    const page = await context.newPage();

    // Scrape from both sources
    const midjourneyImages = await scrapeMidjourneyImages(page, 25);
    const mageImages = await scrapeMageSpaceImages(page, 25);

    const allImages = [...midjourneyImages, ...mageImages];
    console.log(`\n📦 Total images scraped: ${allImages.length}\n`);

    // Save to database
    const { savedCount, skippedCount } = await saveImagesToDatabase(allImages);

    console.log(`\n✅ Successfully saved ${savedCount} new images`);
    if (skippedCount > 0) {
      console.log(`⏭️  Skipped ${skippedCount} duplicate images`);
    }

    const totalInDb = await prisma.image.count();
    console.log(`\n📊 Total images in database: ${totalInDb}`);

    await context.close();
  } catch (error) {
    console.error('❌ Error during scraping:', error);
    throw error;
  } finally {
    await browser.close();
    await prisma.$disconnect();
  }
}

// Run the scraper
scrapeAIImages()
  .then(() => {
    console.log('\n✨ AI image scraping complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Fatal error:', error);
    process.exit(1);
  });
