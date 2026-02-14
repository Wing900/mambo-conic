#!/usr/bin/env node
/**
 * Optimize PNG images using sharp
 * Reduces file size while maintaining quality
 */

import sharp from 'sharp';
import { readdirSync, statSync, writeFileSync } from 'fs';
import { join } from 'path';

const IMAGES_DIR = './public/images';

async function optimizeImage(inputPath, outputPath) {
  try {
    const originalSize = statSync(inputPath).size;

    const image = sharp(inputPath);

    // Optimize PNG: reduce quality and use efficient encoding
    const optimizedBuffer = await image
      .png({
        quality: 80,
        compressionLevel: 9,
        adaptiveFiltering: true,
        effort: 10
      })
      .toBuffer();

    writeFileSync(outputPath, optimizedBuffer);

    const newSize = statSync(outputPath).size;
    const savings = ((originalSize - newSize) / originalSize * 100).toFixed(1);

    console.log(`✓ ${inputPath}: ${(originalSize / 1024 / 1024).toFixed(2)}MB → ${(newSize / 1024 / 1024).toFixed(2)}MB (-${savings}%)`);

  } catch (error) {
    console.error(`✗ Error optimizing ${inputPath}:`, error.message);
  }
}

async function main() {
  console.log('Optimizing PNG images...\n');

  const files = readdirSync(IMAGES_DIR).filter(f => f.endsWith('.png'));

  console.log(`Found ${files.length} PNG images\n`);

  for (const file of files) {
    const inputPath = join(IMAGES_DIR, file);
    await optimizeImage(inputPath, inputPath);
  }

  console.log('\n✅ Image optimization complete!');
}

main();
