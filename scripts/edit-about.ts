import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';

async function main() {
  const zai = await ZAI.create();
  const imageBuffer = fs.readFileSync('/tmp/video-character-raw.jpg');
  const dataUrl = `data:image/jpeg;base64,${imageBuffer.toString('base64')}`;
  console.log('Editing about image...');
  const response = await zai.images.generations.edit({
    prompt: 'Keep this exact anime character — same black kimono with white collar and circular emblem, black messy hair, black-rimmed glasses, anime style. Change the scene: the character is now sitting at a desk working on a laptop, focused expression, warm desk lamp lighting from the side. Dark room ambiance, coding setup visible. Keep the same anime art style. High quality.',
    images: [{ url: dataUrl }],
    size: '1024x1024',
  });
  fs.writeFileSync('./public/images/about-character.png', Buffer.from(response.data[0].base64, 'base64'));
  console.log('About character saved');
}

main().catch(e => { console.error(e.message); process.exit(1); });
