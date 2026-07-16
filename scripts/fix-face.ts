import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';

async function main() {
  const zai = await ZAI.create();

  const imageBuffer = fs.readFileSync('./public/images/hero-character.png');
  const dataUrl = `data:image/png;base64,${imageBuffer.toString('base64')}`;

  console.log('Fixing face and neck — removing black patches...');

  const response = await zai.images.generations.edit({
    prompt: `Fix the character's face and neck. The face currently has black patches/areas on the lower face (nose, mouth, chin area) and the neck is black. 

Please fix:
1. Remove ALL black patches from the face — show proper skin tone on the entire face (forehead, nose, cheeks, mouth, chin)
2. Remove the black from the neck — show proper skin tone on the neck
3. Keep the black hair, black glasses, and black kimono/robe exactly as they are
4. Keep the white collar and circular emblem
5. The face should have a natural, clean anime-style skin tone (light/peach color, not black)
6. Keep the transparent background
7. Maintain the same anime art style, clean lines, and overall design

The ONLY change is: replace the black areas on the face and neck with proper skin tone. Do not change anything else.`,
    images: [{ url: dataUrl }],
    size: '1024x1024',
  });

  const outputBuffer = Buffer.from(response.data[0].base64, 'base64');
  fs.writeFileSync('./public/images/hero-character.png', outputBuffer);
  console.log('Face and neck fixed — saved');
}

main().catch(e => { console.error(e.message); process.exit(1); });
