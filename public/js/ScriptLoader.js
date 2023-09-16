// function to insert a single script into the document's head
import { createNotification } from './NotificationManager.js';
const loadScript = src => {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.type = 'module';
        script.onload = resolve;
        script.onerror = reject;
        script.src = src;
        document.head.appendChild(script);
    });
};

// main function to load all scripts
const loadAllScripts = async () => {
    let start = new Date();
    try {
        // get the list of script paths from the server
        const response = await fetch('/scripts');
        if (!response.ok) {
            throw new Error(`HTTP error ${response.status}`);
        }

        const scriptPaths = await response.json(); // assuming server returns json
        // alternatively, use response.text() if server returns plain text

        // insert all the scripts
        for (const path of scriptPaths) {
            await loadScript(path);
        }

        console.log('all scripts loaded');
        let end = new Date();
        let time = end - start;
        createNotification('ScriptLoader', `All scripts loaded in ${time}ms`);
    } catch (error) {
        console.error('failed to load some scripts:', error);
    }
};

// load all scripts when the page has loaded
document.addEventListener('DOMContentLoaded', loadAllScripts);
