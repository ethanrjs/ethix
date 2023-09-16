// sfxengine.js

import { createNotification } from './NotificationManager.js';

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

// execute the function
checkAutoplay();
