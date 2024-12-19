# Color Picker Extension

這是一個Chrome擴展，允許使用者在瀏覽器中獲取顏色並找出最接近的Minecraft方塊顏色。使用者可以選擇顏色後，點擊Minecraft方塊圖示以獲取該方塊的ID。

## 功能

- 獲取使用者選擇的顏色
- 找出最接近的Minecraft方塊顏色
- 顯示最接近的5個Minecraft方塊顏色及其ID
- 直觀的彈出介面供使用者選擇顏色

## 檔案結構

```
color-picker-extension/
├── src/
│   ├── background.js
│   ├── content.js
│   ├── popup/
│   │   ├── popup.html
│   │   ├── popup.js
│   │   └── popup.css
│   └── manifest.json
├── assets/
│   └── icon.png
└── README.md
```

## 安裝

1. 下載或克隆此專案。
2. 打開Chrome瀏覽器，進入擴展管理頁面（chrome://extensions）。
3. 開啟「開發者模式」。
4. 點擊「載入已解壓的擴展」，選擇專案資料夾。
5. 擴展將會顯示在擴展管理頁面中。

## 使用方法

1. 點擊擴展圖示以打開彈出介面。
2. 使用顏色選擇器選擇您想要的顏色。
3. 點擊Minecraft方塊圖示以獲取最接近的方塊顏色及其ID。

## 貢獻

歡迎任何形式的貢獻！請提交問題或拉取請求。

## 授權

此專案採用MIT授權。詳情請參閱LICENSE檔案。