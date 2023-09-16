import { Program } from 'ApplicationManager';

let options = {
    'show-desktop-icons': true
};

function main() {
    console.time('settings loaded');
    console.log(document.getElementById('settings-window'));
    const settingsOptions = document.querySelectorAll(
        '.settings-options-option span'
    );
    settingsOptions.forEach(option => {
        console.log('loaded option');
        option.addEventListener('click', () => {
            if (option.textContent.trim() === 'toggle_on') {
                option.textContent = 'toggle_off';
                option.parentElement.classList.remove('enabled');
                options[option.parentElement.dataset.option] = false;
            } else {
                option.textContent = 'toggle_on';
                option.parentElement.classList.add('enabled');
                options[option.parentElement.dataset.option] = true;
            }
        });
    });
    console.timeEnd('settings loaded');
}

new Program(
    'Settings',
    'settings-window',
    'taskbar-settings',
    'apps/settings/settings.html',
    'apps/settings/settings.css',
    main
);

// select all .settings-option-option span elements
// when clicked, toggle them (toggle class 'enabled', if the content of the span is toggle_on set it to toggle_off and vice versa)
