// scripts/removePollinationsImages.js
/**
 * Remove all Pollinations AI images from the database
 *
 * This script finds and removes all images from the Pollinations AI source
 * to ensure only Midjourney and Mage.space images are used.
 *
 * Usage:
 *   node scripts/removePollinationsImages.js
 */

import { PrismaClient } from '../src/generated/prisma/index.js';

const prisma = new PrismaClient();

async function removePollinationsImages() {
  console.log('🔍 Searching for Pollinations AI images in database...\n');

  try {
    // Find all images with Pollinations in the source or URL
    const pollinationsImages = await prisma.image.findMany({
      where: {
        OR: [
          { source: { contains: 'Pollinations', mode: 'insensitive' } },
          { url: { contains: 'pollinations.ai', mode: 'insensitive' } },
        ],
      },
    });

    console.log(`Found ${pollinationsImages.length} Pollinations AI images\n`);

    if (pollinationsImages.length === 0) {
      console.log('✅ No Pollinations images found. Database is clean!');
      return;
    }

    // Display the images that will be deleted
    console.log('Images to be deleted:');
    pollinationsImages.forEach((img, index) => {
      console.log(`  ${index + 1}. ${img.source} - ${img.url.substring(0, 60)}...`);
    });

    console.log('\n🗑️  Deleting Pollinations AI images...\n');

    // Delete all Pollinations images
    const deleteResult = await prisma.image.deleteMany({
      where: {
        OR: [
          { source: { contains: 'Pollinations', mode: 'insensitive' } },
          { url: { contains: 'pollinations.ai', mode: 'insensitive' } },
        ],
      },
    });

    console.log(`✅ Successfully deleted ${deleteResult.count} Pollinations AI images\n`);

    // Show remaining image count by source
    const remainingImages = await prisma.image.groupBy({
      by: ['source'],
      _count: {
        _all: true,
      },
    });

    console.log('📊 Remaining images in database by source:');
    remainingImages.forEach(group => {
      console.log(`  - ${group.source}: ${group._count._all}`);
    });

    const totalImages = await prisma.image.count();
    console.log(`\n📦 Total images in database: ${totalImages}`);

  } catch (error) {
    console.error('❌ Error removing Pollinations images:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the cleanup script
removePollinationsImages()
  .then(() => {
    console.log('\n✨ Cleanup complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Fatal error:', error);
    process.exit(1);
  });
