// scripts/populateImages.js
import { PrismaClient } from '../src/generated/prisma/index.js';

const prisma = new PrismaClient();

// Image service implementations
const UNSPLASH_KEY = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;
const PEXELS_KEY = process.env.PEXELS_API_KEY;

async function fetchRealImagesFromUnsplash(count = 10) {
  if (!UNSPLASH_KEY) {
    console.warn('⚠️  Unsplash API key not configured');
    return [];
  }

  const query = 'nature,portrait,street,architecture';
  const url = `https://api.unsplash.com/photos/random?count=${count}&query=${encodeURIComponent(query)}`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Client-ID ${UNSPLASH_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.status}`);
    }

    const data = await response.json();

    return data
      .filter(photo => photo.urls.regular || photo.urls.small || photo.urls.full)
      .map((photo) => ({
        url: photo.urls.regular || photo.urls.small || photo.urls.full || '',
        isAI: false,
        source: 'Unsplash',
        photographer: photo.user.name,
        credits: `Photo by ${photo.user.name}`,
      }));
  } catch (error) {
    console.error('❌ Error fetching images from Unsplash:', error.message);
    return [];
  }
}

async function fetchRealImagesFromPexels(count = 10) {
  if (!PEXELS_KEY) {
    console.warn('⚠️  Pexels API key not configured');
    return [];
  }

  const query = 'nature landscape';
  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${count}`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: PEXELS_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(`Pexels API error: ${response.status}`);
    }

    const data = await response.json();

    return data.photos
      .filter(photo => photo.src.medium || photo.src.large || photo.src.original)
      .map((photo) => ({
        url: photo.src.medium || photo.src.large || photo.src.original || '',
        isAI: false,
        source: 'Pexels',
        photographer: photo.photographer,
        credits: `Photo by ${photo.photographer}`,
      }));
  } catch (error) {
    console.error('❌ Error fetching images from Pexels:', error.message);
    return [];
  }
}

async function populateImages() {
  console.log('🚀 Starting image population from external APIs...\n');

  try {
    const countPerSource = 15;

    console.log(`📸 Fetching ${countPerSource} images from Unsplash...`);
    const unsplashImages = await fetchRealImagesFromUnsplash(countPerSource);
    console.log(`✅ Fetched ${unsplashImages.length} images from Unsplash\n`);

    console.log(`📸 Fetching ${countPerSource} images from Pexels...`);
    const pexelsImages = await fetchRealImagesFromPexels(countPerSource);
    console.log(`✅ Fetched ${pexelsImages.length} images from Pexels\n`);

    const allImages = [...unsplashImages, ...pexelsImages];
    console.log(`📦 Total images fetched: ${allImages.length}\n`);

    if (allImages.length === 0) {
      console.log('⚠️  No images fetched. Please check your API keys in .env file\n');
      console.log('Required API keys:');
      console.log('  - NEXT_PUBLIC_UNSPLASH_ACCESS_KEY');
      console.log('  - PEXELS_API_KEY');

      // Fall back to sample images
      console.log('\n📦 Using sample images instead...\n');
      const sampleImages = [
      {
        url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
        source: 'Unsplash',
        type: 'real',
        metadata: {
          photographer: 'Samuel Ferrara',
          credits: 'Photo by Samuel Ferrara'
        }
      },
      {
        url: 'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2',
        source: 'Unsplash',
        type: 'real',
        metadata: {
          photographer: 'Pawel Czerwinski',
          credits: 'Photo by Pawel Czerwinski'
        }
      },
      {
        url: 'https://images.unsplash.com/photo-1557683316-973673baf926',
        source: 'Unsplash',
        type: 'real',
        metadata: {
          photographer: 'Lucas Benjamin',
          credits: 'Photo by Lucas Benjamin'
        }
      },
      {
        url: 'https://images.unsplash.com/photo-1529778873920-4da4926a72c2',
        source: 'Unsplash',
        type: 'real',
        metadata: {
          photographer: 'Kari Shea',
          credits: 'Photo by Kari Shea'
        }
      },
      {
        url: 'https://images.unsplash.com/photo-1574169208507-83a69f43f5f2',
        source: 'Unsplash',
        type: 'ai',
        metadata: {
          model: 'DALL-E 2',
          credits: 'AI Generated'
        }
      },
      {
        url: 'https://images.unsplash.com/photo-1617791160505-6f00504e3519',
        source: 'Unsplash',
        type: 'ai',
        metadata: {
          model: 'Stable Diffusion 2.1',
          credits: 'AI Generated'
        }
      },
      {
        url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe',
        source: 'Unsplash',
        type: 'ai',
        metadata: {
          model: 'Midjourney v5',
          credits: 'AI Generated'
        }
      },
      {
        url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19',
        source: 'Unsplash',
        type: 'ai',
        metadata: {
          model: 'DALL-E 2',
          credits: 'AI Generated'
        }
      }
    ];

      // Use sample images as fallback
      allImages.push(...sampleImages);
    }

    console.log('💾 Saving images to database...\n');
    let savedCount = 0;
    let skippedCount = 0;

    // Insert the images
    for (const imageData of allImages) {
      try {
        // Check if image already exists
        const existingImage = await prisma.image.findUnique({
          where: { url: imageData.url },
        });

        if (!existingImage) {
          // Create new image record
          await prisma.image.create({
            data: {
              url: imageData.url,
              source: imageData.source,
              type: imageData.isAI || imageData.type === 'ai' ? 'ai' : 'real',
              metadata: {
                photographer: imageData.photographer,
                model: imageData.model,
                credits: imageData.credits,
              },
            },
          });
          savedCount++;
          console.log(`  ✓ Added: ${imageData.source} - ${imageData.url.substring(0, 50)}...`);
        } else {
          skippedCount++;
          console.log(`  ⏭️  Skipped (duplicate): ${imageData.url.substring(0, 50)}...`);
        }
      } catch (error) {
        console.error(`  ❌ Failed to save image: ${error.message}`);
      }
    }

    console.log(`\n✅ Successfully saved ${savedCount} new images`);
    if (skippedCount > 0) {
      console.log(`⏭️  Skipped ${skippedCount} duplicate images`);
    }

    const totalInDb = await prisma.image.count();
    console.log(`\n📊 Total images in database: ${totalInDb}`);

  } catch (error) {
    console.error('❌ Error populating images:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

populateImages()
  .then(() => {
    console.log('\n✨ Image population complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Fatal error:', error);
    process.exit(1);
  });