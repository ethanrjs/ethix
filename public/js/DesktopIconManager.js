// get all .desktop-icon elements on page
// for each, call AppManager.openApp(data-appname)
import { Program } from 'ApplicationManager';

const elements = document.querySelectorAll('.desktop-icon');

elements.forEach(element => {
    element.addEventListener('click', event => {
        const appName = element.getAttribute('data-appname');
        Program.openFromName(appName);
        console.log(`Opening ${appName}`);
    });
});
