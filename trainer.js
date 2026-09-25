const API_URL = "http://localhost:8000";

let karten = [];
let index = 0;
let aufgedeckt = false;

function pieptonAbspielen(frequenz = 700) {
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
}

async function neueRunde() {
    const antwort = await fetch(`${API_URL}/trainer?anzahl=3`);
    karten = await antwort.json();
    index = 0;
    kartenAnzeigen();
}

function kartenAnzeigen() {
    if (karten.length === 0) {
        document.getElementById("karte-wort").textContent = "Keine Vokabeln vorhanden.";
        return;
    }

    const [, wort, genus, ru, en] = karten[index];
    aufgedeckt = false;

    document.getElementById("karte-genus").textContent = genus !== "-" ? genus : "";
    document.getElementById("karte-wort").textContent = wort;
    document.getElementById("karte-uebersetzung").textContent = "";
    document.getElementById("fortschritt").textContent = `Karte ${index + 1} von ${karten.length} — klicken zum Aufdecken`;
    document.getElementById("naechste-btn").disabled = true;
}

function uebersetzungZeigen() {
    if (aufgedeckt || karten.length === 0) return;
    aufgedeckt = true;

    const [, , , ru, en] = karten[index];
    const uebersetzung = ru !== "-" ? ru : en;
    document.getElementById("karte-uebersetzung").textContent = uebersetzung;
    document.getElementById("naechste-btn").disabled = false;

    pieptonAbspielen();
}

function naechsteKarte() {
    index++;
    if (index >= karten.length) {
        document.getElementById("fortschritt").textContent = "Runde fertig! 🎉";
        document.getElementById("karte-wort").textContent = "Klick 'Neue Runde' für mehr.";
        document.getElementById("karte-genus").textContent = "";
        document.getElementById("karte-uebersetzung").textContent = "";
        document.getElementById("naechste-btn").disabled = true;
        pieptonAbspielen(1000);
        return;
    }
    kartenAnzeigen();
}

neueRunde();