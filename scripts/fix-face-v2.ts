import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';

async function main() {
  const zai = await ZAI.create();

  const imageBuffer = fs.readFileSync('./public/images/hero-character.png');
  const dataUrl = `data:image/png;base64,${imageBuffer.toString('base64')}`;

  console.log('Fixing face/neck black patches while preserving white collar...');

  const response = await zai.images.generations.edit({
    prompt: `Fix ONLY the black patches on the face and neck skin. The character has black patches on the lower face (around nose/mouth/chin) and the neck skin area.

IMPORTANT RULES:
1. Replace black skin areas with natural anime skin tone (light peach/beige)
2. KEEP the white collar/garment under the kimono BRIGHT WHITE — do not darken or change it
3. KEEP the black hair, black glasses, and black kimono exactly as they are
4. The white collar should remain pure white (255,255,255)
5. Only fix the SKIN areas that are unnaturally black
6. Keep transparent background
7. Maintain the same anime art style

The white garment visible at the neck (under the black kimono) must stay bright white. Only fix black patches on the actual skin (face and neck).`,
    images: [{ url: dataUrl }],
    size: '1024x1024',
  });

  const outputBuffer = Buffer.from(response.data[0].base64, 'base64');
  fs.writeFileSync('./public/images/hero-character.png', outputBuffer);
  console.log('Face fixed, white collar preserved');
}

main().catch(e => { console.error(e.message); process.exit(1); });
