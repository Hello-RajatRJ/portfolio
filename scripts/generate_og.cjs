const sharp = require('sharp');
const path = require('path');

const svg = `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="bgGlow" cx="80%" cy="20%" r="65%">
      <stop offset="0%" stop-color="#E62429" stop-opacity="0.22" />
      <stop offset="50%" stop-color="#8B0000" stop-opacity="0.08" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0" />
    </radialGradient>
    <linearGradient id="redLine" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#8B0000" stop-opacity="0.1" />
      <stop offset="30%" stop-color="#E62429" />
      <stop offset="70%" stop-color="#FF2D2D" />
      <stop offset="100%" stop-color="#8B0000" stop-opacity="0.1" />
    </linearGradient>
    <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="60%" stop-color="#EEEEEE" />
      <stop offset="100%" stop-color="#E62429" />
    </linearGradient>
  </defs>

  <!-- Deep Obsidian Background -->
  <rect width="1200" height="630" fill="#070709" />
  <rect width="1200" height="630" fill="url(#bgGlow)" />

  <!-- Outer Architectural Framing -->
  <rect x="24" y="24" width="1152" height="582" rx="20" fill="none" stroke="#E62429" stroke-opacity="0.35" stroke-width="1.5" />
  <rect x="36" y="36" width="1128" height="558" rx="14" fill="none" stroke="#FFFFFF" stroke-opacity="0.06" stroke-width="1" />

  <!-- Diagonal Signature Katana Slash Accent -->
  <line x1="-100" y1="590" x2="1300" y2="480" stroke="#E62429" stroke-opacity="0.15" stroke-width="2" />
  <line x1="60" y1="605" x2="1140" y2="605" stroke="url(#redLine)" stroke-width="3" />

  <!-- Top Availability Strip -->
  <g transform="translate(64, 76)">
    <rect width="520" height="36" rx="18" fill="#0e0e12" stroke="#E62429" stroke-opacity="0.4" stroke-width="1" />
    <circle cx="22" cy="18" r="5" fill="#10B981" />
    <text x="38" y="23" font-family="monospace" font-size="12" font-weight="bold" fill="#FFFFFF" letter-spacing="1">
      AVAILABLE FOR OPPORTUNITIES
    </text>
    <text x="290" y="23" font-family="monospace" font-size="12" fill="#9CA3AF" letter-spacing="0.5">
      • RELOCATION / FREELANCE
    </text>
  </g>

  <!-- Brand Mark -->
  <g transform="translate(1005, 74)">
    <rect width="130" height="38" rx="8" fill="#000000" stroke="#E62429" stroke-width="1.5" />
    <text x="65" y="25" font-family="sans-serif" font-size="16" font-weight="900" fill="#FFFFFF" text-anchor="middle" letter-spacing="2">
      RAJAT<tspan fill="#E62429">.DEV</tspan>
    </text>
  </g>

  <!-- Hero Name & Title -->
  <text x="64" y="210" font-family="sans-serif" font-size="76" font-weight="900" fill="url(#accentGrad)" letter-spacing="-1">
    RAJAT AMBEDKAR
  </text>
  <text x="66" y="262" font-family="monospace" font-size="22" font-weight="bold" fill="#FF2D2D" letter-spacing="4">
    FULL-STACK DEVELOPER // 3D WEB ARCHITECT
  </text>

  <!-- One-Line Value Statement -->
  <text x="66" y="320" font-family="sans-serif" font-size="24" font-weight="400" fill="#D1D5DB">
    Building high-performance React &amp; Node products and interactive 3D web
  </text>
  <text x="66" y="355" font-family="sans-serif" font-size="24" font-weight="400" fill="#D1D5DB">
    applications for healthcare, EdTech, and FinTech teams worldwide.
  </text>

  <!-- Proof Metric Badges -->
  <g transform="translate(64, 400)">
    <!-- Badge 1 -->
    <rect x="0" y="0" width="165" height="68" rx="12" fill="#0f0f14" stroke="#ffffff" stroke-opacity="0.12" stroke-width="1" />
    <text x="20" y="36" font-family="sans-serif" font-size="26" font-weight="900" fill="#FFFFFF">4+ <tspan fill="#E62429">Years</tspan></text>
    <text x="20" y="55" font-family="monospace" font-size="11" fill="#9CA3AF">COMMERCIAL EXP</text>

    <!-- Badge 2 -->
    <rect x="185" y="0" width="185" height="68" rx="12" fill="#0f0f14" stroke="#ffffff" stroke-opacity="0.12" stroke-width="1" />
    <text x="205" y="36" font-family="sans-serif" font-size="26" font-weight="900" fill="#FFFFFF">8+ <tspan fill="#E62429">Shipped</tspan></text>
    <text x="205" y="55" font-family="monospace" font-size="11" fill="#9CA3AF">PRODUCTION APPS</text>

    <!-- Badge 3 -->
    <rect x="390" y="0" width="215" height="68" rx="12" fill="#0f0f14" stroke="#ffffff" stroke-opacity="0.12" stroke-width="1" />
    <text x="410" y="36" font-family="sans-serif" font-size="26" font-weight="900" fill="#FFFFFF">5+ <tspan fill="#E62429">Countries</tspan></text>
    <text x="410" y="55" font-family="monospace" font-size="11" fill="#9CA3AF">GLOBAL CLIENT REACH</text>

    <!-- Badge 4: Lighthouse -->
    <rect x="625" y="0" width="180" height="68" rx="12" fill="#0f0f14" stroke="#10B981" stroke-opacity="0.4" stroke-width="1" />
    <text x="645" y="36" font-family="sans-serif" font-size="26" font-weight="900" fill="#10B981">98/100</text>
    <text x="645" y="55" font-family="monospace" font-size="11" fill="#9CA3AF">LIGHTHOUSE AUDIT</text>
  </g>

  <!-- Core Tech Stack Chips -->
  <g transform="translate(64, 510)">
    <text x="0" y="-10" font-family="monospace" font-size="11" font-weight="bold" fill="#6B7280" letter-spacing="2">
      CORE ENGINEERING STACK
    </text>
    <rect x="0" y="0" width="100" height="32" rx="6" fill="#14141c" stroke="#ffffff" stroke-opacity="0.12" />
    <text x="50" y="21" font-family="monospace" font-size="12" font-weight="bold" fill="#FFFFFF" text-anchor="middle">React 19</text>

    <rect x="112" y="0" width="115" height="32" rx="6" fill="#14141c" stroke="#ffffff" stroke-opacity="0.12" />
    <text x="169" y="21" font-family="monospace" font-size="12" font-weight="bold" fill="#FFFFFF" text-anchor="middle">TypeScript</text>

    <rect x="239" y="0" width="95" height="32" rx="6" fill="#14141c" stroke="#ffffff" stroke-opacity="0.12" />
    <text x="286" y="21" font-family="monospace" font-size="12" font-weight="bold" fill="#FFFFFF" text-anchor="middle">Node.js</text>

    <rect x="346" y="0" width="140" height="32" rx="6" fill="#14141c" stroke="#ffffff" stroke-opacity="0.12" />
    <text x="416" y="21" font-family="monospace" font-size="12" font-weight="bold" fill="#FFFFFF" text-anchor="middle">Three.js / WebGL</text>

    <rect x="498" y="0" width="115" height="32" rx="6" fill="#14141c" stroke="#ffffff" stroke-opacity="0.12" />
    <text x="555" y="21" font-family="monospace" font-size="12" font-weight="bold" fill="#FFFFFF" text-anchor="middle">PostgreSQL</text>

    <rect x="625" y="0" width="85" height="32" rx="6" fill="#14141c" stroke="#ffffff" stroke-opacity="0.12" />
    <text x="667" y="21" font-family="monospace" font-size="12" font-weight="bold" fill="#FFFFFF" text-anchor="middle">Python</text>

    <rect x="722" y="0" width="90" height="32" rx="6" fill="#14141c" stroke="#ffffff" stroke-opacity="0.12" />
    <text x="767" y="21" font-family="monospace" font-size="12" font-weight="bold" fill="#FFFFFF" text-anchor="middle">Docker</text>

    <rect x="824" y="0" width="105" height="32" rx="6" fill="#14141c" stroke="#ffffff" stroke-opacity="0.12" />
    <text x="876" y="21" font-family="monospace" font-size="12" font-weight="bold" fill="#FFFFFF" text-anchor="middle">Gemini AI</text>
  </g>

  <!-- URL watermark -->
  <text x="1135" y="535" font-family="monospace" font-size="13" font-weight="bold" fill="#6B7280" text-anchor="end" letter-spacing="1">
    rj-ambedkar-portfolio.netlify.app
  </text>
</svg>`;

const outputPath = path.resolve(__dirname, '../public/og-image.png');

sharp(Buffer.from(svg))
  .png({ quality: 95, compressionLevel: 9 })
  .toFile(outputPath)
  .then((info) => {
    console.log('Successfully generated 1200x630 OG image at ' + outputPath, info);
  })
  .catch((err) => {
    console.error('Sharp error:', err);
    process.exit(1);
  });
