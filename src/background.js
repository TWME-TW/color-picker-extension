let blockColors = [];

// 改用 async/await 載入檔案
async function loadBlockColors() {
    try {
        const response = await fetch(chrome.runtime.getURL('blockColors.json'));
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        blockColors = await response.json();
        console.log('Block colors loaded:', blockColors.length);
    } catch (error) {
        console.error('Error loading blockColors.json:', error);
    }
}

// 初始化時載入
loadBlockColors();

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'getClosestBlocks') {
        // 確保資料已載入
        if (blockColors.length === 0) {
            sendResponse({ closestBlocks: [] });
            return;
        }
        const color = message.color;
        const closestBlocks = findClosestMinecraftBlocks(color);
        sendResponse({ closestBlocks });
    }
    return true; // 保持連接開啟以支援異步回應
});

function findClosestMinecraftBlocks(color) {
    // 找出最接近的顏色邏輯
    const closestBlocks = blockColors.map(block => {
        return {
            id: block.id,
            color: block.color,
            image: block.image,
            distance: getColorDistance(color, block.color)
        };
    }).sort((a, b) => a.distance - b.distance).slice(0, 6);

    return closestBlocks;
}

function getColorDistance(color1, color2) {
    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);
    return Math.sqrt(Math.pow(rgb1.r - rgb2.r, 2) + Math.pow(rgb1.g - rgb2.g, 2) + Math.pow(rgb1.b - rgb2.b, 2));
}

function hexToRgb(hex) {
    let r = 0, g = 0, b = 0;
    if (hex.length == 4) {
        r = parseInt(hex[1] + hex[1], 16);
        g = parseInt(hex[2] + hex[2], 16);
        b = parseInt(hex[3] + hex[3], 16);
    } else if (hex.length == 7) {
        r = parseInt(hex[1] + hex[2], 16);
        g = parseInt(hex[3] + hex[4], 16);
        b = parseInt(hex[5] + hex[6], 16);
    }
    return { r, g, b };
}