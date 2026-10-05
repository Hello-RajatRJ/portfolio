const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '../public/avatar_aligned');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

async function generateAligned() {
  const inputPath = path.join(__dirname, '../public/finalimage.png');
  const { data, info } = await sharp(inputPath).raw().toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height;

  const rowNames = [
    ['front', 'front_left', 'profile_left', 'back', 'profile_right', 'front_right'],
    ['up', 'down', 'up_left', 'up_right', 'down_left', 'down_right'],
    ['smile', 'serious', 'surprised', 'angry', 'wink', 'look_away']
  ];
  
  const rowRanges = [
    [0, 340],
    [341, 680],
    [681, 1023]
  ];

  const fineTuning = {
    down_left: { dx: 6.5, dy: 1.0 },
    smile: { dx: -2.1, dy: 0 },
    look_away: { dx: -1.8, dy: 0 },
  };

  const targetNeckX = 140;
  const targetNeckY = 190;
  const targetW = 280;
  const targetH = 320;

  for (let r = 0; r < 3; r++) {
    const [yStart, yEnd] = rowRanges[r];
    for (let c = 0; c < 6; c++) {
      const name = rowNames[r][c];
      const approxX = Math.round((c + 0.5) * 256);
      
      // Step 1: Find neck center in finalimage
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
      const ft = fineTuning[name] || { dx: 0, dy: 0 };
      const neckX = (nX / nC) + ft.dx;
      const neckY = (nY / nC) + ft.dy;

      // Step 2: Flood fill (BFS) starting from neck to isolate this figure
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

        // Stay within this row's Y bounds
        const neighbors = [
          [cx - 1, cy], [cx + 1, cy], [cx, cy - 1], [cx, cy + 1]
        ];
        for (const [nx, ny] of neighbors) {
          if (nx >= 0 && nx < W && ny >= yStart && ny <= yEnd) {
            // Also don't bleed into next column beyond bounds
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

      // Step 3: Create target image buffer
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

      const outBuf = await sharp(outData, { raw: { width: targetW, height: targetH, channels: 4 } })
        .webp({ quality: 98, lossless: false })
        .toBuffer();

      // Write to both avatar_aligned and avatar_transparent
      fs.writeFileSync(path.join(outDir, `${name}.webp`), outBuf);
      fs.writeFileSync(path.join(__dirname, `../public/avatar_transparent/${name}.webp`), outBuf);
      console.log(`Generated perfectly aligned frame: ${name}.webp`);
    }
  }
}
generateAligned();
