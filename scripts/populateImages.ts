// scripts/populateImages.ts
import { databaseService } from '../src/services/databaseService.js';

async function populateImages() {
  console.log('Populating database with sample images...');

  try {
    await databaseService.populateImages(50);
    console.log('Successfully populated database with images!');
    process.exit(0);
  } catch (error) {
    console.error('Error populating images:', error);
    process.exit(1);
  }
}

populateImages();