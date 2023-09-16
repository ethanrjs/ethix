// showContextMenu() shows context menu at mouse position
// context menu element is #context-menu

const showContextMenu = e => {
    e.preventDefault();
    const contextMenu = document.getElementById('context-menu');
    contextMenu.style.display = 'flex';
    contextMenu.style.left = `${e.clientX}px`;
    contextMenu.style.top = `${e.clientY}px`;
};

// hide context menu when anything but context menu is clicked
document.addEventListener('click', e => {
    const contextMenu = document.getElementById('context-menu');
    if (e.target !== contextMenu) {
        contextMenu.style.display = 'none';
    }
});
