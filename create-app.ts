// This file is an easy cli app generator.
import inquirer from 'inquirer';
import fs from 'fs';
import chalk from 'chalk';
import path from 'path';

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
        validate: (input: string | any[]) => {
            if (input.length < 1) {
                return 'Please enter a valid identifier.';
            }
            return true;
        }
    },
    {
        name: 'name',
        message: 'What is the proper name of the app? (e.g. Hello World)',
        validate: (input: string | any[]) => {
            if (input.length < 1) {
                return 'Please enter a valid name.';
            }
            return true;
        }
    },
    {
        name: 'desktopIcon',
        message: 'Should it have a desktop icon? (y/n)',
        validate: (input: string | any[]) => {
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
        validate: (input: string | any[]) => {
            if (input.length < 1) {
                return 'Please enter a valid icon name.';
            }
            return true;
        },
        when: (answers: { desktopIcon: string; }) => answers.desktopIcon === 'y'
    }
];

inquirer.prompt(questions).then((answers: { identifier: any; name: any; desktopIcon: any; icon: any; }) => {
    const { identifier, name, desktopIcon, icon } = answers;

    // create app directory in public/apps
    const appDirectory = path.join(import.meta.dir, './public/apps', identifier);
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

function appJsTemplate(name: string, identifier: string, desktopIcon: string, icon: string) {
    return `import { Program } from 'ApplicationManager';
${desktopIcon === 'y'
            ? `import { registerDesktopIcon } from 'DesktopIconManager';`
            : ''
        }

function initialize() {}

new Program('${identifier}', '${name}', '${identifier}.html', initialize);
${desktopIcon === 'y'
            ? `
registerDesktopIcon('${identifier}', '${name}', '${icon}');`
            : ''
        }
`;
}

function appHtmlTemplate(name: string, identifier: string) {
    return `<link rel="stylesheet" href="apps/${identifier}/${identifier}.css">
<div id="${identifier}-content">
    <h1>${name}</h1>
</div>`;
}

function appCssTemplate(identifier: string) {
    return `#${identifier}-content {
    padding: 1rem;
}`;
}
