Trainer.registrieren({
    id: "zuordnung",
    name: "Zuordnung",

    start(container, karten, ctx) {
        let gewaehltLinks = null;
        let gewaehltRechts = null;
        let gefunden = 0;
        let fehler = 0;

        container.innerHTML = `
            <div class="zuordnung">
                <div class="spalte" id="z-links"></div>
                <div class="spalte" id="z-rechts"></div>
            </div>`;
        const links = container.querySelector("#z-links");
        const rechts = container.querySelector("#z-rechts");

        function paarElement(karte, seite) {
            const knopf = document.createElement("button");
            knopf.className = "paar";
            knopf.textContent = seite === "links"
                ? (karte.genus ? `${karte.genus} ${karte.wort}` : karte.wort)
                : karte.uebersetzung;
            knopf.onclick = () => waehlen(knopf, karte, seite);
            return knopf;
        }

        function waehlen(knopf, karte, seite) {
            if (knopf.classList.contains("richtig")) return;

            const aktuell = seite === "links" ? gewaehltLinks : gewaehltRechts;
            if (aktuell) aktuell.knopf.classList.remove("gewaehlt");
            knopf.classList.add("gewaehlt");

            const neu = { knopf, karte };
            if (seite === "links") gewaehltLinks = neu; else gewaehltRechts = neu;

            if (gewaehltLinks && gewaehltRechts) pruefen();
        }

        function pruefen() {
            const a = gewaehltLinks;
            const b = gewaehltRechts;
            gewaehltLinks = gewaehltRechts = null;

            // Gleiche Übersetzung zählt als richtig (falls zwei Wörter dasselbe bedeuten)
            if (a.karte.uebersetzung === b.karte.uebersetzung) {
                for (const x of [a, b]) {
                    x.knopf.classList.remove("gewaehlt");
                    x.knopf.classList.add("richtig");
                    x.knopf.disabled = true;
                }
                gefunden++;
                ctx.piep(800);
                ctx.setFortschritt(`${gefunden} von ${karten.length} Paaren gefunden`);
                if (gefunden === karten.length) {
                    ctx.fertig(`Alle Paare gefunden — ${fehler} Fehler`);
                }
            } else {
                fehler++;
                ctx.piep(250);
                for (const x of [a, b]) {
                    x.knopf.classList.remove("gewaehlt");
                    x.knopf.classList.add("falsch");
                    setTimeout(() => x.knopf.classList.remove("falsch"), 400);
                }
            }
        }

        ctx.mischen(karten).forEach((k) => links.appendChild(paarElement(k, "links")));
        ctx.mischen(karten).forEach((k) => rechts.appendChild(paarElement(k, "rechts")));
        ctx.setFortschritt(`0 von ${karten.length} Paaren gefunden`);
    },
});