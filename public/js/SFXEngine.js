// sfxengine.js

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
