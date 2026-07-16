import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';

async function main() {
  const zai = await ZAI.create();

  const imageBuffer = fs.readFileSync('/tmp/video-character-raw.jpg');
  const base64Image = imageBuffer.toString('base64');
  const dataUrl = `data:image/jpeg;base64,${base64Image}`;

  console.log('Editing image — adding laptop to character...');

  const response = await zai.images.generations.edit({
    prompt: `Keep this exact anime character exactly as is — same black kimono with white collar and circular chest emblem, jet black messy medium-length hair, round black-rimmed glasses, anime art style, clean lines, soft shading.

IMPORTANT CHANGE: The character should now be holding a modern silver laptop with both hands in front of their chest, as if presenting it or working on it. The laptop screen is slightly open with a subtle blue glow. The character's arms are positioned naturally to hold the laptop.

Keep the same minimalist anime art style. Simple dark gradient background. Full body visible, standing upright. High quality, detailed.`,
    images: [{ url: dataUrl }],
    size: '768x1344',
  });

  const imageBase64 = response.data[0].base64;
  const outputBuffer = Buffer.from(imageBase64, 'base64');
  fs.writeFileSync('./public/images/hero-character.png', outputBuffer);
  console.log('Hero character saved to ./public/images/hero-character.png');
}

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
