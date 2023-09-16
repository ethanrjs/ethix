import { Program } from 'ApplicationManager';

// for each child of #taskbar
// add a click listener that opens data-appname
const taskbar = document.getElementById('taskbar');
for (const child of taskbar.children) {
    child.addEventListener('click', () => {
        const appName = child.dataset.appname;
        Program.openFromName(appName);
    });
}
