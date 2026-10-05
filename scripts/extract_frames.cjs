const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function extractFrames() {
  const dir = path.join(__dirname, '../public/avatar_frames');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const inputPath = path.join(__dirname, '../public/myimage.png');
  const img = sharp(inputPath);
  const meta = await img.metadata();
  const totalW = meta.width; // 1536
  const totalH = meta.height; // 1024

  const frameNames = [
    // Row 0
    'front', 'front_left', 'profile_left', 'back_left', 'back', 'back_right',
    // Row 1
    'profile_right', 'front_right', 'up', 'down', 'up_left', 'up_right',
    // Row 2
    'down_left', 'down_right', 'turn_left', 'turn_right', 'tilt_left', 'tilt_right'
  ];

  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 6; col++) {
      const idx = row * 6 + col;
      const name = frameNames[idx];

      const cellLeft = Math.round(col * (totalW / 6));
      const cellTop = Math.round(row * (totalH / 3));

      // Crop inside 2px to avoid any border divider lines, and crop before the bottom label bar (y < 308)
      const left = cellLeft + 2;
      const top = cellTop + 2;
      const width = Math.floor(totalW / 6) - 4; // 252px
      const height = 304; // cleanly cuts off before the 29px label bar at bottom

      await sharp(inputPath)
        .extract({ left, top, width, height })
        .webp({ quality: 96 })
        .toFile(path.join(dir, `${name}.webp`));
      console.log(`Clean extracted: ${name}.webp (${width}x${height})`);
    }
  }
  console.log('All 18 frames cleanly extracted without borders or labels!');
}
extractFrames().catch(err => console.error(err));
