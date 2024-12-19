import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const blocksDir = path.join(__dirname, 'block');

async function getBlockList() {
    return fs.readdirSync(blocksDir).filter(file => file.endsWith('.png')).map(file => file.replace('.png', ''));
}

async function readImage(block) {
    const filePath = path.join(blocksDir, `${block}.png`);
    console.log(`Reading image from ${filePath}`);
    try {
        const image = await sharp(filePath).raw().toBuffer({ resolveWithObject: true });
        console.log(`Successfully read image: ${filePath}`);
        return image;
    } catch (error) {
        console.error(`Error reading image: ${filePath}`, error);
        throw error;
    }
}

function getAverageColor({ data, info }) {
    let red = 0, green = 0, blue = 0;
    const pixelCount = info.width * info.height;

    for (let i = 0; i < data.length; i += 3) {
        red += data[i];
        green += data[i + 1];
        blue += data[i + 2];
    }

    red = Math.floor(red / pixelCount);
    green = Math.floor(green / pixelCount);
    blue = Math.floor(blue / pixelCount);

    return `#${((1 << 24) + (red << 16) + (green << 8) + blue).toString(16).slice(1)}`;
}

async function generateBlockColors() {
    const blocks = await getBlockList();
    const blockColors = [];

    for (const block of blocks) {
        try {
            const image = await readImage(block);
            const color = getAverageColor(image);
            blockColors.push({ id: `minecraft:${block}`, color });
            console.log(`Processed ${block}: ${color}`);
        } catch (error) {
            console.error(`Failed to process ${block}:`, error.message);
        }
    }

    fs.writeFileSync(path.join(__dirname, 'blockColors.json'), JSON.stringify(blockColors, null, 2));
    console.log('Block colors saved to blockColors.json');
}

generateBlockColors();