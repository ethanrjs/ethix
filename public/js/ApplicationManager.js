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
        this.backgroundServices = {};
        this.windows = {};
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
    }

    startProgram(name, program) {
        if (!this.programs[name]) {
            this.programs[name] = program;
            program.start();
        } else {
            // restore window if it was minimized
            this.restoreWindow(name);
        }
    }

    stopProgram(name) {
        const program = this.programs[name];
        if (program) {
            program.stop();
            delete this.programs[name];
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
        } else {
            console.log(`${name} window is already open.`);
        }
    }

    closeWindow(name) {
        const windowElement = this.windows[name];
        if (windowElement) {
            windowElement.style.display = 'none';
            delete this.windows[name];
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
        });

        window.addEventListener('mousemove', e => {
            if (isDragging) {
                windowElement.style.left = `${e.clientX - offsetX}px`;
                windowElement.style.top = `${e.clientY - offsetY}px`;
            }
        });

        window.addEventListener('mouseup', () => {
            isDragging = false;
            windowElement.style.cursor = 'default';
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
        if (windowElement) {
            // Save original dimensions and position
            windowElement.dataset.originalWidth = windowElement.style.width;
            windowElement.dataset.originalHeight = windowElement.style.height;
            windowElement.dataset.originalLeft = windowElement.style.left;
            windowElement.dataset.originalTop = windowElement.style.top;

            // Maximize
            windowElement.style.width = '100%';
            windowElement.style.height = '100%';
            windowElement.style.left = '0';
            windowElement.style.top = '0';
        } else {
            console.log(`${name} window is not open.`);
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
