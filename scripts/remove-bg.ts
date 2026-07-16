import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';

async function main() {
  const zai = await ZAI.create();
  const imageBuffer = fs.readFileSync('./public/images/hero-character.png');
  const dataUrl = `data:image/jpeg;base64,${imageBuffer.toString('base64')}`;

  console.log('Removing background from hero image...');

  const response = await zai.images.generations.edit({
    prompt: 'Remove the background entirely. Make the background fully transparent (PNG with alpha channel). Keep ONLY the anime character — the person in black kimono/hoodie holding a silver laptop, with black hair and glasses. The character should float on a transparent background with no rectangle, no gradient, no frame, no border. Just the character figure alone. Maintain the exact same anime art style, clean lines, and all details of the character and laptop. Do not add any background, shadow, or frame.',
    images: [{ url: dataUrl }],
    size: '768x1344',
  });

  const outputBuffer = Buffer.from(response.data[0].base64, 'base64');
  fs.writeFileSync('./public/images/hero-character.png', outputBuffer);
  console.log('Hero image background removed — saved to ./public/images/hero-character.png');
}

main().catch(e => { console.error(e.message); process.exit(1); });
