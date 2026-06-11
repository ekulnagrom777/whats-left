// Generates og-card.svg's dot field, then og.png via sharp.
// Run: node og-gen.js  (from the whats-left folder)
const fs = require('fs');

const W = 1200, H = 630;
const CELL = 24, R = 5.5;
// dot wall fills the right-hand band of the card
const x0 = 760, y0 = 60, cols = 17, rows = 21;
const total = cols * rows, used = Math.floor(total * 0.34);

let dots = '';
for (let i = 0; i < total; i++) {
  const cx = x0 + (i % cols) * CELL + CELL / 2;
  const cy = y0 + Math.floor(i / cols) * CELL + CELL / 2;
  if (i < used) {
    dots += `<circle cx="${cx}" cy="${cy}" r="${R * 0.8}" fill="#4b4b56"/>`;
  } else if (i === used) {
    dots += `<circle cx="${cx}" cy="${cy}" r="${R * 2.2}" fill="url(#nowdot)"/>`;
  } else {
    dots += `<circle cx="${cx}" cy="${cy}" r="${R * 1.9}" fill="url(#leftdot)"/>`;
  }
}

let svg = fs.readFileSync('og-card.svg', 'utf8');
svg = svg.replace('<g id="dots"></g>', `<g id="dots">${dots}</g>`);
fs.writeFileSync('og-final.svg', svg);

const sharp = require('sharp');
sharp(Buffer.from(svg), { density: 96 })
  .resize(W, H)
  .png()
  .toFile('og.png')
  .then(() => console.log('og.png written'))
  .catch(e => { console.error(e); process.exit(1); });
