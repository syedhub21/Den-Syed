import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';

async function main() {
  const zai = await ZAI.create();

  const imageBuffer = fs.readFileSync('/tmp/video-character-raw.jpg');
  const dataUrl = `data:image/jpeg;base64,${imageBuffer.toString('base64')}`;

  console.log('Regenerating hero character with laptop, solid background...');

  const response = await zai.images.generations.edit({
    prompt: `Keep this exact anime character exactly as is — same black kimono with white collar and circular chest emblem, jet black messy medium-length hair, round black-rimmed glasses, anime art style, clean lines, soft shading.

IMPORTANT CHANGE: The character should now be holding a modern silver laptop with both hands in front of their chest, as if presenting it or working on it. The laptop screen is slightly open with a subtle blue glow. The character's arms are positioned naturally to hold the laptop.

Keep the same minimalist anime art style. The background should be a SIMPLE FLAT SOLID COLOR (dark gray, matching hsl(0 0% 12%)) with NO gradient, NO pattern, NO text — just a flat solid color so it blends seamlessly into a dark webpage. Full body visible, standing upright. High quality, detailed.`,
    images: [{ url: dataUrl }],
    size: '768x1344',
  });

  const imageBase64 = response.data[0].base64;
  const outputBuffer = Buffer.from(imageBase64, 'base64');
  fs.writeFileSync('./public/images/hero-character.png', outputBuffer);
  console.log('Hero character saved with solid flat background');
}

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
