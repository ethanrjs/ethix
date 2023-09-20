import { Program } from 'ApplicationManager';
import Database from 'Database';

const db = new Database('ethix-settings', 'settings');

let options = {
    'show-desktop-icons': true
};

async function main() {
    console.log(document.getElementById('ethix-settings-window'));
    const settingsOptions = document.querySelectorAll(
        '.settings-options-option span.toggler'
    );
    settingsOptions.forEach(async option => {
        option.addEventListener('click', async () => {
            if (option.textContent.trim() === 'toggle_on') {
                option.textContent = 'toggle_off';
                option.parentElement.classList.remove('enabled');
                options[option.parentElement.dataset.option] = false;
                document.getElementById('desktop-icons').style.display = 'none';

                await db.set('settings', JSON.stringify(options));
            } else {
                option.textContent = 'toggle_on';
                option.parentElement.classList.add('enabled');
                options[option.parentElement.dataset.option] = true;

                document.getElementById('desktop-icons').style.display =
                    'block';

                await db.set('settings', JSON.stringify(options));
            }
        });
    });

    // add display none to all .settings-page elements, unless they have the class 'active'
    const settingsPages = document.querySelectorAll('.settings-page');
    settingsPages.forEach(page => {
        if (!page.classList.contains('active')) {
            page.style.display = 'none';
        }
    });

    // when a .settings-sidebar-item is clicked, remove the class 'active' from all .settings-sidebar-item elements
    // then add it to the clicked element
    // get the data-tab value from the .settings-sidebar-item element and use it to get the corresponding .settings-page element
    // the .settings-page element will have a data-page value that corresponds to the data-tab value of the .settings-sidebar-item element
    // add the class 'active' to the .settings-page element and remove it from all other .settings-page elements
    const sidebarItems = document.querySelectorAll('.settings-sidebar-item');
    sidebarItems.forEach(item => {
        item.addEventListener('click', () => {
            sidebarItems.forEach(item => {
                item.classList.remove('active');
            });
            item.classList.add('active');

            const tab = item.dataset.tab;
            const page = document.querySelector(
                `.settings-page[data-page="${tab}"]`
            );

            const pages = document.querySelectorAll('.settings-page');
            pages.forEach(page => {
                page.classList.remove('active');
                page.style.display = 'none';
            });

            page.classList.add('active');
            page.style.display = 'block';
        });
    });

    // get all .image-pick elements
    // select direct parent
    // get data-option value and when a file is selected, set the background image of the parent to the selected file
    // add to indexed db and load image from indexed db when page is loaded
    // note: this function runs when page is loaded
    const imagePickers = document.querySelectorAll('.image-pick-input');
    imagePickers.forEach(picker => {
        const option = picker.dataset.option;

        picker.addEventListener('change', async () => {
            const file = picker.files[0];
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = async () => {
                loadSettings();
                await db.set(option, reader.result);
            };
        });
    });

    // when page loads, set background to db.get || dont change

    // when a .option-interact is right clicked, set option in data-option to data-default
    const optionInteracts = document.querySelectorAll('.option-interact');
    optionInteracts.forEach(interact => {
        console.log('loaded interact');
        interact.addEventListener('contextmenu', async e => {
            e.preventDefault();
            const option = interact.dataset.option;
            const defaultValue = interact.dataset.default;

            options[option] = defaultValue;

            await db.set('settings', JSON.stringify(options));
            console.log('set option to default');
        });

        loadSettings();
    });

    // #option-interact
    // option to change background to center, stretch, fill or tile
    // it is a select element with options

    // when option is clicked, set background style to option value
    const backgroundStyle = document.querySelector('#background-style-pick');
    backgroundStyle.addEventListener('change', async () => {
        const value = backgroundStyle.value;
        await db.set('background-style', value);

        // set background
        loadSettings();

        console.log('set background style to ' + value);
    });

    loadSettings();
}

async function loadSettings() {
    // load all settings from indexed db
    // then process the changes they make

    // 1. desktop icons
    // 2. background

    const settings = await db.get('settings');
    if (settings) {
        options = JSON.parse(settings);
    }

    if (options['show-desktop-icons']) {
        document.getElementById('desktop-icons').style.display = 'block';
        // toggle off the option
        const option = document.querySelector(
            '.settings-options-option[data-option="show-desktop-icons"]'
        );
        option.classList.add('enabled');
        const toggler = option.querySelector('span.toggler');
        toggler.textContent = 'toggle_on';
    } else {
        document.getElementById('desktop-icons').style.display = 'none';
        // toggle off the option
        const option = document.querySelector(
            '.settings-options-option[data-option="show-desktop-icons"]'
        );
        option.classList.remove('enabled');
        const toggler = option.querySelector('span.toggler');
        toggler.textContent = 'toggle_off';
    }

    const background = await db.get('background');
    if (background) {
        document.body.style.backgroundImage = `url(${background})`;
    }

    // change background style
    const backgroundStyle = await db.get('background-style');
    if (backgroundStyle) {
        // if value is 'stretch', set background size to 100% 100%
        // if value is 'fill', set background size to cover, change other properties if needed
        // if value is 'center', set background size to auto, change other properties if needed
        // if value is 'tile', set background size to auto, change other properties if needed

        if (backgroundStyle === 'stretch') {
            document.body.style.backgroundSize = '100% 100%';
            document.body.style.backgroundPosition = 'center';
            document.body.style.backgroundRepeat = 'no-repeat';
        } else if (backgroundStyle === 'fill') {
            document.body.style.backgroundSize = 'cover';
            document.body.style.backgroundPosition = 'center';
            document.body.style.backgroundRepeat = 'no-repeat';
        } else if (backgroundStyle === 'center') {
            document.body.style.backgroundSize = 'auto';
            document.body.style.backgroundPosition = 'center';
            document.body.style.backgroundRepeat = 'no-repeat';
        } else if (backgroundStyle === 'tile') {
            document.body.style.backgroundSize = 'auto';
            document.body.style.backgroundPosition = 'center';
            document.body.style.backgroundRepeat = 'repeat';
        }
    }
}

new Program('ethix-settings', 'Settings', 'settings.html', main);

// select all .settings-option-option span elements
// when clicked, toggle them (toggle class 'enabled', if the content of the span is toggle_on set it to toggle_off and vice versa)
