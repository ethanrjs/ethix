// This file is an easy cli app generator.
const inquirer = require('inquirer');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

// ask questions:
// 1. What is the identifier of the app? (e.g. hello-world)
// 2. What is the proper name of the app? (e.g. Hello World)
// 3. Should it have a desktop icon? (y/n)
// 4. What google material icon name should be used for the desktop icon? (e.g. add)
// then create the app directory and files
const questions = [
    {
        name: 'identifier',
        message: 'What is the identifier of the app? (e.g. hello-world)',
        validate: input => {
            if (input.length < 1) {
                return 'Please enter a valid identifier.';
            }
            return true;
        }
    },
    {
        name: 'name',
        message: 'What is the proper name of the app? (e.g. Hello World)',
        validate: input => {
            if (input.length < 1) {
                return 'Please enter a valid name.';
            }
            return true;
        }
    },
    {
        name: 'desktopIcon',
        message: 'Should it have a desktop icon? (y/n)',
        validate: input => {
            if (input.length !== 1 || (input !== 'y' && input !== 'n')) {
                return 'Please enter y or n.';
            }
            return true;
        }
    },
    {
        name: 'icon',
        message:
            'What google material icon name should be used for the desktop icon? (e.g. add)',
        validate: input => {
            if (input.length < 1) {
                return 'Please enter a valid icon name.';
            }
            return true;
        },
        when: answers => answers.desktopIcon === 'y'
    }
];

inquirer.prompt(questions).then(answers => {
    const { identifier, name, desktopIcon, icon } = answers;

    // create app directory in public/apps
    const appDirectory = path.join(__dirname, './public/apps', identifier);
    fs.mkdirSync(appDirectory);

    // create appname.js, appname.css and appname.html in app directory
    const appJs = path.join(appDirectory, `${identifier}.js`);
    const appCss = path.join(appDirectory, `${identifier}.css`);
    const appHtml = path.join(appDirectory, `${identifier}.html`);
    fs.writeFileSync(appJs, appJsTemplate(name, identifier, desktopIcon, icon));
    fs.writeFileSync(appCss, appCssTemplate(identifier));
    fs.writeFileSync(appHtml, appHtmlTemplate(name, identifier));
    console.log(
        chalk.green(
            `Successfully created app ${name} with identifier ${identifier}.`
        )
    );
});

// I hate this below code so much. Please propose a better solution.

function appJsTemplate(name, identifier, desktopIcon, icon) {
    return `import { Program } from 'ApplicationManager';
${
    desktopIcon === 'y'
        ? `import { registerDesktopIcon } from 'DesktopIconManager';`
        : ''
}

function initialize() {}

new Program('${identifier}', '${name}', '${identifier}.html', initialize);
${
    desktopIcon === 'y'
        ? `
registerDesktopIcon('${identifier}', '${name}', '${icon}');`
        : ''
}
`;
}

function appHtmlTemplate(name, identifier) {
    return `<link rel="stylesheet" href="apps/${identifier}/${identifier}.css">
<div id="${identifier}-content">
    <h1>${name}</h1>
</div>`;
}

function appCssTemplate(identifier) {
    return `#${identifier}-content {
    padding: 1rem;
}`;
}
