import fs from 'fs';
import path from 'path';

const blockColors = JSON.parse(fs.readFileSync('blockColors.json', 'utf8'));

const updatedBlockColors = blockColors
    .filter(block => block.color !== '#aN')
    .map(block => ({
        id: block.id,
        color: block.color,
        image: `block/${block.id.replace('minecraft:', '')}.png`
    }));

fs.writeFileSync(
    'blockColors.json',
    JSON.stringify(updatedBlockColors, null, 2)
);

console.log(`Updated ${updatedBlockColors.length} blocks with image paths`);