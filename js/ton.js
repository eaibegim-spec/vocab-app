const Ton = {
    piep(frequenz = 700) {
        const kontext = new (window.AudioContext || window.webkitAudioContext)();
        const oszillator = kontext.createOscillator();
        const lautstaerke = kontext.createGain();

        oszillator.connect(lautstaerke);
        lautstaerke.connect(kontext.destination);

        oszillator.type = "sine";
        oszillator.frequency.value = frequenz;
        lautstaerke.gain.setValueAtTime(0.15, kontext.currentTime);
        lautstaerke.gain.exponentialRampToValueAtTime(0.001, kontext.currentTime + 0.3);

        oszillator.start();
        oszillator.stop(kontext.currentTime + 0.3);
    },
};