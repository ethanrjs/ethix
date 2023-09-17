// sfxengine.js

import { createNotification } from './NotificationManager.js';

let sounds = [];
export function SFXSound(name) {
    // play sound assets/sounds/name.wav
    let sound = new Audio('assets/sounds/' + name + '.wav');
    // set volume to 20%
    sound.volume = 0.2;

    sound.play();

    // remove sound from memory when done
    sound.addEventListener('ended', function () {
        sound.remove();
    });
}

// when the page loads, check if autoplay is enabled
// if it isnt, tell the user to enable it
async function checkAutoplay() {
    // create a new audio element
    const audio = new Audio('assets/sounds/notification.wav');
    audio.volume = 0.001;

    try {
        // attempt to play the audio
        await audio.play();

        // if we reach here, autoplay is enabled
        console.log('autoplay is enabled');
    } catch (error) {
        // autoplay was prevented, call your function here
        createNotification(
            'Autoplay',
            'Please enable Autoplay in your browser settings for the best experience.'
        );
    }
}

export async function playSound(path, volume) {
    // load a sound into memory relative to where the function is called
    const audio = new Audio(path);
    audio.volume = volume;
    await audio.play();
    audio.remove();
}
// execute the function
checkAutoplay();
