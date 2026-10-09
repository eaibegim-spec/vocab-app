Trainer.registrieren({
    id: "flip",
    name: "Flip-Karten",

    start(container, karten, ctx) {
        let index = 0;
        let gewusst = 0;
        let umgedreht = false;

        container.innerHTML = `
            <div class="flip" id="flip">
                <div class="flip-innen">
                    <div class="flip-seite vorne">
                        <div class="genus"></div>
                        <div class="wort"></div>
                    </div>
                    <div class="flip-seite hinten"></div>
                </div>
            </div>
            <div>
                <button id="flip-nein" disabled>✗ Nicht gewusst</button>
                <button id="flip-ja" disabled>✓ Gewusst</button>
            </div>`;

        const flip = container.querySelector("#flip");
        const nein = container.querySelector("#flip-nein");
        const ja = container.querySelector("#flip-ja");

        function zeigen() {
            const karte = karten[index];
            umgedreht = false;
            flip.classList.remove("umgedreht");
            flip.querySelector(".genus").textContent = karte.genus;
            flip.querySelector(".wort").textContent = karte.wort;
            flip.querySelector(".hinten").textContent = karte.uebersetzung;
            nein.disabled = ja.disabled = true;
            ctx.setFortschritt(`Karte ${index + 1} von ${karten.length} — klicken zum Umdrehen`);
        }

        function umdrehen() {
            if (umgedreht) return;
            umgedreht = true;
            flip.classList.add("umgedreht");
            nein.disabled = ja.disabled = false;
            ctx.piep();
        }

        function bewerten(warGewusst) {
            if (warGewusst) gewusst++;
            index++;
            if (index >= karten.length) {
                container.innerHTML = "";
                ctx.setFortschritt("Runde fertig! 🎉");
                ctx.fertig(`${gewusst} von ${karten.length} gewusst`);
                return;
            }
            zeigen();
        }

        flip.onclick = umdrehen;
        ja.onclick = () => bewerten(true);
        nein.onclick = () => bewerten(false);
        zeigen();
    },
});