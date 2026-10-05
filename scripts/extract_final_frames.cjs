const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function extractCleanTransparentFrames() {
  const dir = path.join(__dirname, '../public/avatar_transparent');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const inputPath = path.join(__dirname, '../public/finalimage.png');
  const frameMap = [
    // Row 0
    ['front', 'front_left', 'profile_left', 'back', 'profile_right', 'front_right'],
    // Row 1
    ['up', 'down', 'up_left', 'up_right', 'down_left', 'down_right'],
    // Row 2
    ['smile', 'serious', 'surprised', 'angry', 'wink', 'look_away']
  ];

  const rowTops = [0, 341, 682];
  const cropH = 312;
  const colW = 256;

  for (let r = 0; r < 3; r++) {
    const top = rowTops[r];
    for (let c = 0; c < 6; c++) {
      const name = frameMap[r][c];
      const left = c * colW;

      // Extract raw cell
      const rawSlice = await sharp(inputPath)
        .extract({ left, top, width: colW, height: cropH })
        .raw()
        .toBuffer({ resolveWithObject: true });

      const { data, info } = rawSlice;
      const W = info.width, H = info.height;

      // Remove any neighbor figure islands using connected components from center
      const visited = new Uint8Array(W * H);
      const queue = [];
      const startX = Math.floor(W / 2);
      const startY = Math.floor(H * 0.35);

      for (let rad = 0; rad < 50; rad++) {
        let found = false;
        for (let dy = -rad; dy <= rad; dy++) {
          for (let dx = -rad; dx <= rad; dx++) {
            const ny = startY + dy, nx = startX + dx;
            if (nx >= 0 && nx < W && ny >= 0 && ny < H) {
              const idx = ny * W + nx;
              if (data[idx * 4 + 3] > 80 && !visited[idx]) {
                visited[idx] = 1;
                queue.push(idx);
                found = true;
                break;
              }
            }
          }
          if (found) break;
        }
        if (found) break;
      }

      let qHead = 0;
      while (qHead < queue.length) {
        const curr = queue[qHead++];
        const cx = curr % W;
        const cy = Math.floor(curr / W);

        const neighbors = [
          [cx - 1, cy], [cx + 1, cy], [cx, cy - 1], [cx, cy + 1],
          [cx - 1, cy - 1], [cx + 1, cy - 1], [cx - 1, cy + 1], [cx + 1, cy + 1]
        ];
        for (const [nx, ny] of neighbors) {
          if (nx >= 0 && nx < W && ny >= 0 && ny < H) {
            const nIdx = ny * W + nx;
            if (!visited[nIdx] && data[nIdx * 4 + 3] > 15) {
              visited[nIdx] = 1;
              queue.push(nIdx);
            }
          }
        }
      }

      for (let i = 0; i < W * H; i++) {
        if (!visited[i]) {
          data[i * 4 + 3] = 0;
        }
      }

      const outBuf = await sharp(data, { raw: { width: W, height: H, channels: 4 } })
        .webp({ quality: 98, lossless: false })
        .toBuffer();

      fs.writeFileSync(path.join(dir, `${name}.webp`), outBuf);
      console.log(`Clean extracted and isolated: ${name}.webp`);
    }
  }

  console.log('All 18 transparent frames generated cleanly without neighbor artifacts.');
}

extractCleanTransparentFrames().catch(err => console.error(err));
