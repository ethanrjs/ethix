import { Program } from 'ApplicationManager';
import { registerDesktopIcon } from 'DesktopIconManager';
let content = '';

function main() {}

new Program('ethix-notes', 'Notes', 'notes.html', main);

registerDesktopIcon('ethix-notes', 'Notes', 'description');
