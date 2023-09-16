import { Program } from 'ApplicationManager';
import { createNotification } from 'NotificationManager';
import { registerDesktopIcon } from 'DesktopIconManager';

function main() {
    console.log('hello world app initialized');
    createNotification('Hello World', 'Hello World App Initialized');
}

registerDesktopIcon('helloworld', 'Hello World', 'waving_hand');

new Program('helloworld', 'Hello World', 'helloworld.html', main);
