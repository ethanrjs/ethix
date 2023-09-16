// get all .desktop-icon elements on page
// for each, call AppManager.openApp(data-appname)
import { Program } from 'ApplicationManager';

export function registerDesktopIcon(appID, appName, iconName) {
    /* <li id="desktop-icon-appID" class="desktop-icon" data-appname="appID"><span
                class="material-symbols-rounded fill">
                iconName
            </span>
            <p class="desktop-icon-appID">appName</p>
        </li>
    */
    // append to #desktop-icons
    const icon = document.createElement('li');
    icon.id = `desktop-icon-${appID}`;
    icon.classList.add('desktop-icon');
    icon.setAttribute('data-appname', appID);
    const iconSpan = document.createElement('span');
    iconSpan.classList.add('material-symbols-rounded');
    iconSpan.classList.add('fill');
    iconSpan.innerText = iconName;
    const iconText = document.createElement('p');
    iconText.classList.add('desktop-icon-text');
    iconText.innerText = appName;
    icon.appendChild(iconSpan);
    icon.appendChild(iconText);
    document.getElementById('desktop-icons').appendChild(icon);
    // add event listener
    icon.addEventListener('click', event => {
        Program.openFromName(appID);
        console.log(`Opening ${appID}`);
    });
}

const elements = document.querySelectorAll('.desktop-icon');

elements.forEach(element => {
    element.addEventListener('click', event => {
        const appName = element.getAttribute('data-appname');
        Program.openFromName(appName);
        console.log(`Opening ${appName}`);
    });
});
