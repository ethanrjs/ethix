// Mock example classes to simulate programs and background services
// jsdoc:
/*
 * @typedef {Object} Program
 * @property {string} name - The name of the program.
 * @property {string} windowId - The id of the window element.
 * @property {string} startButtonId - The id of the start button element.
 * @property {string} htmlFile - The path to the html file.
 * @property {string | string[]} stylesheets - The path(s) to the stylesheet(s).
 * @property {function} onLoad - The function to call when the program is loaded.
 */
export class Program {
    constructor(
        name,
        windowId,
        startButtonId,
        htmlFile,
        stylesheets = [],
        onLoad
    ) {
        this.name = name;
        this.windowId = windowId;
        this.startButtonId = startButtonId;
        this.htmlFile = htmlFile;
        this.stylesheets = Array.isArray(stylesheets)
            ? stylesheets
            : [stylesheets];

        this.onLoad = onLoad;

        this.init();
    }

    async init() {
        await ApplicationManager.loadHtml(this);
        document.getElementById(this.windowId).style.display = 'none';
        AppManager.registerProgram(this);
        this.onLoad();
    }

    start() {
        console.log(`${this.name} started.`);
        ApplicationManager.loadStyles(this.stylesheets);
        AppManager.openWindow(this.name, this.windowId);
    }

    stop() {
        console.log(`${this.name} stopped.`);
        AppManager.closeWindow(this.name);
    }

    static openFromName(name) {
        // starts program from name defined in constructor
        const program = AppManager.programs[name];
        if (program) {
            program.start();
        } else {
            console.log(`${name} is not registered.`);
        }
    }
}

export class BackgroundService {
    constructor(name) {
        this.name = name;
    }
    start() {
        console.log(`${this.name} service started.`);
    }
    stop() {
        console.log(`${this.name} service stopped.`);
    }
}

// ApplicationManager class definition
export class ApplicationManager {
    constructor() {
        this.programs = {};
        this.runningPrograms = {};
        this.backgroundServices = {};
        this.windows = {};
        this.moveOrder = [];
    }

    registerProgram(program) {
        // Register event listeners for the program start button
        const startButton = document.getElementById(program.startButtonId);
        if (startButton) {
            startButton.addEventListener('click', () => {
                this.startProgram(program.name, program);
            });
        }

        // Register event listeners for minimize, maximize, and close buttons
        const windowElement = document.getElementById(program.windowId);
        const titlebarControls = windowElement.querySelector(
            '.window-titlebar-controls'
        );

        titlebarControls
            .querySelector('.window-titlebar-minimize')
            .addEventListener('click', () => {
                this.minimizeWindow(program.name);
            });

        titlebarControls
            .querySelector('.window-titlebar-maximize')
            .addEventListener('click', () => {
                this.maximizeWindow(program.name);
            });

        titlebarControls
            .querySelector('.window-titlebar-close')
            .addEventListener('click', () => {
                this.stopProgram(program.name);
            });

        this.programs[program.name] = program;
    }

    startProgram(name, program) {
        if (!this.runningPrograms[name]) {
            this.runningPrograms[name] = program;
            program.start();
        } else {
            console.log(`${name} is already running.`);
        }
    }

    stopProgram(name) {
        const program = this.runningPrograms[name];
        if (program) {
            program.stop();
            delete this.runningPrograms[name];
        } else {
            console.log(`${name} is not running.`);
        }
    }

    startBackgroundService(name, service) {
        if (!this.backgroundServices[name]) {
            this.backgroundServices[name] = service;
            service.start();
        } else {
            console.log(`${name} service is already running.`);
        }
    }

    stopBackgroundService(name) {
        const service = this.backgroundServices[name];
        if (service) {
            service.stop();
            delete this.backgroundServices[name];
        } else {
            console.log(`${name} service is not running.`);
        }
    }

    openWindow(name, htmlElementId) {
        if (!this.windows[name]) {
            this.windows[name] = document.getElementById(htmlElementId);
            this.windows[name].style.display = 'block';
            // add to running programs
            this.runningPrograms[name] = this.programs[name];

            // add to running order
            // running order is a queue of program names
            // when a program is started, it is added to the end of the queue
            this.moveOrder.push(name);
        } else {
            console.log(`${name} window is already open. Recentering...`);
            this.windows[name].style.display = 'block';
            this.windows[name].style.left = '25%';
            this.windows[name].style.top = '25%';
            // re-add to running programs
            this.runningPrograms[name] = this.programs[name];
        }
    }

    closeWindow(name) {
        const windowElement = this.windows[name];
        if (windowElement) {
            windowElement.style.display = 'none';
            delete this.windows[name];
            // remove from running programs
            delete this.runningPrograms[name];

            // remove from running order
            const index = this.moveOrder.indexOf(name);
            if (index > -1) {
                this.moveOrder.splice(index, 1);
            } else {
                console.log(
                    `Failed to remove ${name} from running order. Index not found. (This should never happen???)`
                );
            }
        } else {
            console.log(`${name} window is not open.`);
        }
    }

    makeWindowMovable(windowElement) {
        let isDragging = false;
        let offsetX, offsetY;

        const titleBarElement = windowElement.querySelector('.window-titlebar');
        titleBarElement.addEventListener('mousedown', e => {
            isDragging = true;
            offsetX = e.clientX - windowElement.getBoundingClientRect().left;
            offsetY = e.clientY - windowElement.getBoundingClientRect().top;
            windowElement.style.cursor = 'move';
            // bring to front of move order
            const index = this.moveOrder.indexOf(windowElement.id);
            if (index > -1) {
                this.moveOrder.splice(index, 1);
                this.moveOrder.push(windowElement.id);
            }
            // set z-index to 9998 - index
            windowElement.style.zIndex =
                9998 - this.moveOrder.indexOf(windowElement.id);

            console.log(this.moveOrder);
        });

        window.addEventListener('mousemove', e => {
            if (isDragging) {
                windowElement.style.left = `${e.clientX - offsetX}px`;
                windowElement.style.top = `${e.clientY - offsetY}px`;
                // bring to front of move order
                const index = this.moveOrder.indexOf(windowElement.id);
                if (index > -1) {
                    this.moveOrder.splice(index, 1);
                    this.moveOrder.push(windowElement.id);
                }
                // set z-index to 9998 - index
                windowElement.style.zIndex =
                    9998 - this.moveOrder.indexOf(windowElement.id);
            }
        });

        window.addEventListener('mouseup', () => {
            isDragging = false;
            windowElement.style.cursor = 'default';
            // bring to front of move order
            const index = this.moveOrder.indexOf(windowElement.id);
            if (index > -1) {
                this.moveOrder.splice(index, 1);
                this.moveOrder.push(windowElement.id);
            }
            // set z-index to 9998 - index
            windowElement.style.zIndex =
                9998 - this.moveOrder.indexOf(windowElement.id);
        });

        window.addEventListener('resize', () => {
            if (windowElement.style.left !== '50%') {
                windowElement.style.left = '50%';
            }
            if (windowElement.style.top !== '50%') {
                windowElement.style.top = '50%';
            }
        });
    }

    minimizeWindow(name) {
        const windowElement = this.windows[name];
        if (windowElement) {
            windowElement.style.display = 'none';
        } else {
            console.log(`${name} window is not open.`);
        }
    }

    maximizeWindow(name) {
        const windowElement = this.windows[name];
        // if fullscreen, restore, otherwise maximize
        if (windowElement.dataset.originalWidth) {
            this.restoreWindow(name);
            console.log(`${name} window restored.`);
        } else {
            if (windowElement) {
                // Save original dimensions and position
                windowElement.dataset.originalWidth =
                    windowElement.style.width || '50%';
                windowElement.dataset.originalHeight =
                    windowElement.style.height || '50%';
                windowElement.dataset.originalLeft =
                    windowElement.style.left || '0%';
                windowElement.dataset.originalTop =
                    windowElement.style.top || '0%';

                // Maximize
                windowElement.style.width = '100%';
                windowElement.style.height = '100%';
                windowElement.style.left = '0';
                windowElement.style.top = '0';
            } else {
                console.log(`${name} window is not open.`);
            }
        }
    }

    restoreWindow(name) {
        const windowElement = this.windows[name];
        if (windowElement && windowElement.dataset.originalWidth) {
            windowElement.style.display = 'block';
            windowElement.style.width = windowElement.dataset.originalWidth;
            windowElement.style.height = windowElement.dataset.originalHeight;
            windowElement.style.left = windowElement.dataset.originalLeft;
            windowElement.style.top = windowElement.dataset.originalTop;

            delete windowElement.dataset.originalWidth;
            delete windowElement.dataset.originalHeight;
            delete windowElement.dataset.originalLeft;
            delete windowElement.dataset.originalTop;
        } else {
            console.log(`${name} window is not open or was never maximized.`);
        }
    }

    static loadStyles(stylesheets) {
        stylesheets.forEach(stylesheet => {
            const linkElement = document.createElement('link');
            linkElement.rel = 'stylesheet';
            linkElement.type = 'text/css';
            linkElement.href = stylesheet;
            linkElement.id = `${stylesheet}-stylesheet`;
            document.head.appendChild(linkElement);
        });
    }

    static async loadHtml(program) {
        return new Promise((resolve, reject) => {
            console.log(`Loading ${program.name} HTML...`);
            const xhr = new XMLHttpRequest();
            xhr.open('GET', program.htmlFile, true);
            xhr.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    console.log(`${program.name} HTML loaded successfully.`);
                    const body = document.querySelector('body');
                    body.insertAdjacentHTML('beforeend', this.responseText);
                    // make window movable
                    const windowElement = document.getElementById(
                        program.windowId
                    );
                    AppManager.makeWindowMovable(windowElement);

                    resolve();
                } else if (this.readyState == 4) {
                    reject(new Error('Failed to load HTML.'));
                }
            };
            xhr.send();
        });
    }
}

export let AppManager = new ApplicationManager();
