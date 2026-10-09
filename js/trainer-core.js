/*
 * Kern des Trainers.
 * Ein Modus ist ein Objekt: { id, name, start(container, karten, ctx) }
 * und meldet sich mit Trainer.registrieren(...) an.
 */
const Trainer = (() => {
    const modi = new Map();
    let aktiverModus = null;
    let karten = [];

    const el = (id) => document.getElementById(id);

    // Werkzeuge, die jeder Modus nutzen darf
    // ctx = Kontext: ein Objekt
    const ctx = {
        setFortschritt: (text) => { el("fortschritt").textContent = text; },
        fertig: (text) => { el("ergebnis").textContent = text; Ton.piep(1000); },
        piep: (frequenz) => Ton.piep(frequenz),
        mischen: (liste) => {
            const kopie = [...liste];
            for (let i = kopie.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [kopie[i], kopie[j]] = [kopie[j], kopie[i]];
            }
            return kopie;
        },
    };

    function registrieren(modus) {
        modi.set(modus.id, modus);
    }

    function tabsBauen() {
        const leiste = el("modus-leiste");
        leiste.innerHTML = "";
        for (const modus of modi.values()) {
            const knopf = document.createElement("button");
            knopf.className = "tab";
            knopf.dataset.id = modus.id;
            knopf.textContent = modus.name;
            knopf.onclick = () => modusWaehlen(modus.id);
            leiste.appendChild(knopf);
        }
    }

    function modusWaehlen(id) {
        if (!modi.has(id)) id = modi.keys().next().value;
        aktiverModus = modi.get(id);
        location.hash = id;
        document.querySelectorAll(".tab").forEach((t) =>
            t.classList.toggle("aktiv", t.dataset.id === id));
        starten();
    }

    function starten() {
        const container = el("modus-container");
        container.innerHTML = "";
        el("ergebnis").textContent = "";
        ctx.setFortschritt("");

        if (!aktiverModus) return;
        if (karten.length === 0) {
            container.textContent = "Keine Vokabeln vorhanden.";
            return;
        }
        aktiverModus.start(container, karten, ctx);
    }

    async function neueRunde() {
        try {
            karten = await Api.holeKarten(el("anzahl").value);
        } catch (fehler) {
            el("modus-container").textContent = "Fehler beim Laden: " + fehler.message;
            return;
        }
        starten();
    }

    async function init() {
        tabsBauen();
        el("neue-runde").onclick = neueRunde;
        const id = location.hash.slice(1);
        aktiverModus = modi.get(id) || modi.values().next().value;
        document.querySelectorAll(".tab").forEach((t) =>
            t.classList.toggle("aktiv", t.dataset.id === aktiverModus.id));
        await neueRunde();
    }

    document.addEventListener("DOMContentLoaded", init);

    return { registrieren };
})();