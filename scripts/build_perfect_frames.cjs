const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '../public/avatar_transparent');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

async function buildPerfectFrames() {
  const inputPath = path.join(__dirname, '../public/finalimage.png');
  const { data, info } = await sharp(inputPath).raw().toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height;

  // Grid layout in finalimage.png:
  // Row 0:
  // Col 0: Front
  // Col 1: Looking Left (45°)
  // Col 2: Profile Left (90°)
  // Col 3: Back
  // Col 4: Profile Right (90°)
  // Col 5: Looking Right (45°)
  //
  // Row 1:
  // Col 0: Look Up
  // Col 1: Look Down
  // Col 2: Look Up-Right (45°)
  // Col 3: Look Up-Right (alternate)
  // Col 4: Look Down-Left (45°)
  // Col 5: Look Down-Left (alternate)
  //
  // Row 2:
  // Col 0: Smile
  // Col 1: Serious
  // Col 2: Surprised
  // Col 3: Angry
  // Col 4: Wink
  // Col 5: Look Away (looking down-right)

  const definitions = {
    front:         { r: 0, c: 0, flipH: false },
    front_left:    { r: 0, c: 1, flipH: false }, // looking left 45°
    profile_left:  { r: 0, c: 2, flipH: false }, // looking left 90°
    back:          { r: 0, c: 3, flipH: false },
    profile_right: { r: 0, c: 4, flipH: false }, // looking right 90°
    front_right:   { r: 0, c: 5, flipH: false }, // looking right 45°

    up:            { r: 1, c: 0, flipH: false },
    down:          { r: 1, c: 1, flipH: false },
    up_right:      { r: 1, c: 2, flipH: false }, // looking up-right
    up_left:       { r: 1, c: 2, flipH: true },  // mirror of up-right = looking up-left!
    down_left:     { r: 1, c: 4, flipH: false }, // looking down-left
    down_right:    { r: 1, c: 4, flipH: true },  // mirror of down-left = looking down-right!

    smile:         { r: 2, c: 0, flipH: false },
    serious:       { r: 2, c: 1, flipH: false },
    surprised:     { r: 2, c: 2, flipH: false },
    angry:         { r: 2, c: 3, flipH: false },
    wink:          { r: 2, c: 4, flipH: false },
    look_away:     { r: 2, c: 5, flipH: false },
  };

  const rowRanges = [
    [0, 340],
    [341, 680],
    [681, 1023]
  ];

  const targetNeckX = 140;
  const targetNeckY = 190;
  const targetW = 280;
  const targetH = 320;

  for (const [name, def] of Object.entries(definitions)) {
    const [yStart, yEnd] = rowRanges[def.r];
    const approxX = Math.round((def.c + 0.5) * 256);

    // 1. Find neck center
    let nX = 0, nY = 0, nC = 0;
    for (let y = yStart + 160; y <= yStart + 215; y++) {
      for (let x = approxX - 110; x <= approxX + 110; x++) {
        if (x >= 0 && x < W && y >= 0 && y < H) {
          const a = data[(y * W + x) * 4 + 3];
          if (a > 60) {
            nX += x; nY += y; nC++;
          }
        }
      }
    }
    const neckX = nX / nC;
    const neckY = nY / nC;

    // 2. BFS flood fill from neck to isolate figure
    const visited = new Uint8Array(W * H);
    const queue = [];
    const startX = Math.round(neckX);
    const startY = Math.round(neckY);
    const startIdx = startY * W + startX;
    visited[startIdx] = 1;
    queue.push(startIdx);

    let qHead = 0;
    while (qHead < queue.length) {
      const curr = queue[qHead++];
      const cx = curr % W;
      const cy = Math.floor(curr / W);

      const neighbors = [
        [cx - 1, cy], [cx + 1, cy], [cx, cy - 1], [cx, cy + 1]
      ];
      for (const [nx, ny] of neighbors) {
        if (nx >= 0 && nx < W && ny >= yStart && ny <= yEnd) {
          if (Math.abs(nx - approxX) < 135) {
            const nIdx = ny * W + nx;
            if (!visited[nIdx] && data[nIdx * 4 + 3] > 20) {
              visited[nIdx] = 1;
              queue.push(nIdx);
            }
          }
        }
      }
    }

    // 3. Render into targetW x targetH canvas centered on (targetNeckX, targetNeckY)
    const outData = new Uint8Array(targetW * targetH * 4);
    const shiftX = Math.round(neckX) - targetNeckX;
    const shiftY = Math.round(neckY) - targetNeckY;

    for (let ty = 0; ty < targetH; ty++) {
      const sy = ty + shiftY;
      if (sy >= yStart && sy <= yEnd) {
        for (let tx = 0; tx < targetW; tx++) {
          const sx = tx + shiftX;
          if (sx >= 0 && sx < W) {
            const sIdx = sy * W + sx;
            if (visited[sIdx]) {
              const tIdx = (ty * targetW + tx) * 4;
              const s4 = sIdx * 4;
              outData[tIdx] = data[s4];
              outData[tIdx + 1] = data[s4 + 1];
              outData[tIdx + 2] = data[s4 + 2];
              outData[tIdx + 3] = data[s4 + 3];
            }
          }
        }
      }
    }

    // If flipH is true, mirror horizontally around targetNeckX (which is at center 140)
    let finalData = outData;
    if (def.flipH) {
      const flipped = new Uint8Array(targetW * targetH * 4);
      for (let y = 0; y < targetH; y++) {
        for (let x = 0; x < targetW; x++) {
          const srcX = targetW - 1 - x;
          const srcIdx = (y * targetW + srcX) * 4;
          const dstIdx = (y * targetW + x) * 4;
          flipped[dstIdx] = outData[srcIdx];
          flipped[dstIdx + 1] = outData[srcIdx + 1];
          flipped[dstIdx + 2] = outData[srcIdx + 2];
          flipped[dstIdx + 3] = outData[srcIdx + 3];
        }
      }
      finalData = flipped;
    }

    const outBuf = await sharp(finalData, { raw: { width: targetW, height: targetH, channels: 4 } })
      .webp({ quality: 98, lossless: false })
      .toBuffer();

    fs.writeFileSync(path.join(outDir, `${name}.webp`), outBuf);
    console.log(`Generated perfectly aligned: ${name}.webp (flipped: ${def.flipH})`);
  }

  console.log('All 18 poses successfully built and aligned!');
}

buildPerfectFrames();
