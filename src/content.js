document.addEventListener('DOMContentLoaded', function() {
    const colorPicker = document.createElement('input');
    colorPicker.type = 'color';
    document.body.appendChild(colorPicker);

    colorPicker.addEventListener('input', function() {
        const selectedColor = colorPicker.value;
        chrome.runtime.sendMessage({ color: selectedColor }, function(response) {
            console.log('Closest Minecraft blocks:', response.closestBlocks);
        });
    });
});