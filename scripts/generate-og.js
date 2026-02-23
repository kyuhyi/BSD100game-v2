const { createCanvas, registerFont } = require('canvas');
const fs = require('fs');
const path = require('path');

// OG Image dimensions
const WIDTH = 1200;
const HEIGHT = 630;

const canvas = createCanvas(WIDTH, HEIGHT);
const ctx = canvas.getContext('2d');

// Background gradient - deep blue to purple to black
const bgGradient = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);
bgGradient.addColorStop(0, '#0a0a1a');
bgGradient.addColorStop(0.3, '#1a0a2e');
bgGradient.addColorStop(0.6, '#0d1b2a');
bgGradient.addColorStop(1, '#000000');
ctx.fillStyle = bgGradient;
ctx.fillRect(0, 0, WIDTH, HEIGHT);

// Add subtle grid pattern
ctx.strokeStyle = 'rgba(100, 149, 237, 0.05)';
ctx.lineWidth = 1;
for (let i = 0; i < WIDTH; i += 40) {
  ctx.beginPath();
  ctx.moveTo(i, 0);
  ctx.lineTo(i, HEIGHT);
  ctx.stroke();
}
for (let i = 0; i < HEIGHT; i += 40) {
  ctx.beginPath();
  ctx.moveTo(0, i);
  ctx.lineTo(WIDTH, i);
  ctx.stroke();
}

// Add glow spots
const addGlow = (x, y, radius, color) => {
  const glow = ctx.createRadialGradient(x, y, 0, x, y, radius);
  glow.addColorStop(0, color);
  glow.addColorStop(1, 'transparent');
  ctx.fillStyle = glow;
  ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
};

addGlow(200, 150, 300, 'rgba(138, 43, 226, 0.15)');
addGlow(1000, 480, 350, 'rgba(0, 191, 255, 0.1)');
addGlow(600, 315, 400, 'rgba(255, 215, 0, 0.05)');

// Main text
const text = '바퍼 재믹스';
const fontSize = 140;

ctx.font = `bold ${fontSize}px "Malgun Gothic", "맑은 고딕", sans-serif`;
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';

const textX = WIDTH / 2;
const textY = HEIGHT / 2;

// Shadow layers for depth
for (let i = 15; i >= 1; i--) {
  ctx.fillStyle = `rgba(0, 0, 0, ${0.3 - i * 0.015})`;
  ctx.fillText(text, textX + i * 1.5, textY + i * 2);
}

// Metallic gradient for text
const metalGradient = ctx.createLinearGradient(textX - 300, textY - 80, textX + 300, textY + 80);
metalGradient.addColorStop(0, '#e8e8e8');
metalGradient.addColorStop(0.2, '#ffffff');
metalGradient.addColorStop(0.3, '#b8b8b8');
metalGradient.addColorStop(0.5, '#ffffff');
metalGradient.addColorStop(0.6, '#d0d0d0');
metalGradient.addColorStop(0.8, '#ffffff');
metalGradient.addColorStop(1, '#a8a8a8');

// Draw main text with metallic gradient
ctx.fillStyle = metalGradient;
ctx.fillText(text, textX, textY);

// Add chrome highlight effect
const highlightGradient = ctx.createLinearGradient(textX - 300, textY - 60, textX + 300, textY - 20);
highlightGradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
highlightGradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.4)');
highlightGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.6)');
highlightGradient.addColorStop(0.7, 'rgba(255, 255, 255, 0.4)');
highlightGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

ctx.globalCompositeOperation = 'overlay';
ctx.fillStyle = highlightGradient;
ctx.fillText(text, textX, textY - 10);
ctx.globalCompositeOperation = 'source-over';

// Blue accent glow under text
ctx.shadowColor = '#00bfff';
ctx.shadowBlur = 30;
ctx.shadowOffsetX = 0;
ctx.shadowOffsetY = 5;
ctx.strokeStyle = 'rgba(0, 191, 255, 0.3)';
ctx.lineWidth = 2;
ctx.strokeText(text, textX, textY);

// Reset shadow
ctx.shadowColor = 'transparent';
ctx.shadowBlur = 0;
ctx.shadowOffsetX = 0;
ctx.shadowOffsetY = 0;

// Subtle outline for definition
ctx.strokeStyle = 'rgba(80, 80, 80, 0.5)';
ctx.lineWidth = 1;
ctx.strokeText(text, textX, textY);

// Add decorative elements - horizontal lines
const lineY = textY + 100;
const lineGradient = ctx.createLinearGradient(200, lineY, WIDTH - 200, lineY);
lineGradient.addColorStop(0, 'transparent');
lineGradient.addColorStop(0.2, 'rgba(0, 191, 255, 0.5)');
lineGradient.addColorStop(0.5, 'rgba(255, 215, 0, 0.7)');
lineGradient.addColorStop(0.8, 'rgba(0, 191, 255, 0.5)');
lineGradient.addColorStop(1, 'transparent');

ctx.strokeStyle = lineGradient;
ctx.lineWidth = 2;
ctx.beginPath();
ctx.moveTo(200, lineY);
ctx.lineTo(WIDTH - 200, lineY);
ctx.stroke();

// Diamond accents
const drawDiamond = (x, y, size) => {
  ctx.fillStyle = 'rgba(255, 215, 0, 0.8)';
  ctx.beginPath();
  ctx.moveTo(x, y - size);
  ctx.lineTo(x + size, y);
  ctx.lineTo(x, y + size);
  ctx.lineTo(x - size, y);
  ctx.closePath();
  ctx.fill();
};

drawDiamond(180, lineY, 5);
drawDiamond(WIDTH - 180, lineY, 5);

// Save the image
const outputPath = path.join(__dirname, '..', 'public', 'og-image.png');
const buffer = canvas.toBuffer('image/png');
fs.writeFileSync(outputPath, buffer);

console.log('OG image generated:', outputPath);
console.log('Size:', buffer.length, 'bytes');
