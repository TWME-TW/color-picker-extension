document.addEventListener('DOMContentLoaded', function () {
    const colorPicker = document.getElementById('colorPicker');
    const getBlocksButton = document.getElementById('getBlocksButton');
    const pickFromScreen = document.getElementById('pickFromScreen');
    const resultContainer = document.getElementById('resultContainer');

    // 新增螢幕取色按鈕事件
    pickFromScreen.addEventListener('click', async () => {
        // 關閉 popup 以便看到頁面
        window.close();
        
        try {
            // 注入取色腳本到當前頁面
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                function: pickColorFromScreen
            });
        } catch (err) {
            console.error(err);
        }
    });

    // 監聽從頁面傳來的顏色
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.type === 'colorPicked') {
            colorPicker.value = message.color;
            // 自動觸發搜尋
            getBlocksButton.click();
        }
    });

    if (colorPicker && getBlocksButton && resultContainer) {
        getBlocksButton.addEventListener('click', function () {
            const color = colorPicker.value;
            chrome.runtime.sendMessage({ type: 'getClosestBlocks', color: color }, function (response) {
                const closestBlocks = response.closestBlocks;
                resultContainer.innerHTML = '';
                closestBlocks.forEach(block => {
                    const blockElement = document.createElement('div');
                    // 修正圖片路徑
                    const imageUrl = chrome.runtime.getURL(`block/${block.id.replace('minecraft:', '')}.png`);
                    
                    blockElement.innerHTML = `
                        <div class="block-item">
                            <img src="${imageUrl}" 
                                 alt="${block.id}" 
                                 width="50" 
                                 height="50"
                                 onerror="this.src='images/placeholder.png'">
                            <p>ID: ${block.id}</p>
                            <p>Color: ${block.color}</p>
                        </div>
                    `;
                    resultContainer.appendChild(blockElement);
                });
            });
        });
    }
});

// 在頁面上執行的取色腳本
function pickColorFromScreen() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    let picking = false;

    function startPicking(e) {
        if (!picking) return;
        
        // 獲取點擊位置的像素
        const pixelData = ctx.getImageData(e.clientX, e.clientY, 1, 1).data;
        const color = '#' + [
            pixelData[0].toString(16).padStart(2, '0'),
            pixelData[1].toString(16).padStart(2, '0'),
            pixelData[2].toString(16).padStart(2, '0')
        ].join('');

        // 發送顏色給擴充功能
        chrome.runtime.sendMessage({ type: 'colorPicked', color });
        
        // 清理
        document.removeEventListener('click', startPicking);
        document.body.style.cursor = 'default';
        picking = false;
    }

    // 設置畫布大小為視窗大小
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // 將當前視窗內容繪製到畫布
    ctx.drawImage(window, 0, 0);

    // 啟動取色模式
    picking = true;
    document.body.style.cursor = 'crosshair';
    document.addEventListener('click', startPicking);
}