import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const inputDir = path.join(process.cwd(), 'public', 'images', 'clients');
const outputDir = path.join(process.cwd(), 'public', 'images', 'clients', 'optimized');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function optimizeLogos() {
  const files = fs.readdirSync(inputDir);
  for (const file of files) {
    // Skip directories and hidden files
    if (file === 'optimized' || file.startsWith('.') || !fs.statSync(path.join(inputDir, file)).isFile()) continue;
    
    const inputPath = path.join(inputDir, file);
    const fileNameWithoutExt = path.parse(file).name;
    const outputPath = path.join(outputDir, `${fileNameWithoutExt}.webp`);
    
    try {
      await sharp(inputPath)
        .resize({
           width: 200,
           height: 80,
           fit: sharp.fit.inside,
           withoutEnlargement: true // Don't scale up tiny logos past 100%
        })
        .webp({ quality: 90, force: true }) // Force webp formatting
        .toFile(outputPath);
      console.log(`Optimized: ${file} -> ${fileNameWithoutExt}.webp`);
    } catch (e) {
      console.error(`Failed to optimize ${file}:`, e.message);
    }
  }
}

optimizeLogos();
