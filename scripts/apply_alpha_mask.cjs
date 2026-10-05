const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function processFrames() {
  const dir = path.join(__dirname, '../public/avatar_frames');
  const maskPath = path.join(dir, 'alpha_mask.png');
  const maskBuffer = await sharp(maskPath).raw().toBuffer();

  const frameNames = [
    'front', 'front_left', 'profile_left', 'back_left', 'back', 'back_right',
    'profile_right', 'front_right', 'up', 'down', 'up_left', 'up_right',
    'down_left', 'down_right', 'turn_left', 'turn_right', 'tilt_left', 'tilt_right'
  ];

  for (const name of frameNames) {
    const file = path.join(dir, `${name}.webp`);
    if (!fs.existsSync(file)) continue;

    const img = sharp(file);
    const meta = await img.metadata();
    const { data } = await img.raw().toBuffer({ resolveWithObject: true });

    // Combine RGB with alpha mask
    const rgba = Buffer.alloc(meta.width * meta.height * 4);
    for (let i = 0; i < meta.width * meta.height; i++) {
      rgba[i * 4] = data[i * 3];
      rgba[i * 4 + 1] = data[i * 3 + 1];
      rgba[i * 4 + 2] = data[i * 3 + 2];
      rgba[i * 4 + 3] = maskBuffer[i];
    }

    await sharp(rgba, {
      raw: { width: meta.width, height: meta.height, channels: 4 }
    })
      .webp({ quality: 96, lossless: false })
      .toFile(path.join(dir, `${name}_transparent.webp`));

    console.log(`Processed: ${name}_transparent.webp`);
  }
  console.log('All 18 transparent frames generated successfully!');
}

processFrames().catch(err => console.error(err));
