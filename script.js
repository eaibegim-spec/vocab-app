const API_URL = "http://localhost:8000/vokabeln";

// Felder einmal oben holen
const ruFeld = document.getElementById("uebersetzung_ru");
const enFeld = document.getElementById("uebersetzung_en");
const form = document.getElementById("vokabel-form");

// Fehlermeldung zurücksetzen, sobald der Nutzer tippt
[ruFeld, enFeld].forEach(feld =>
    feld.addEventListener("input", () => ruFeld.setCustomValidity(""))
);

async function vokabelnLaden() {
    const antwort = await fetch(API_URL);
    const vokabeln = await antwort.json();

    const liste = document.getElementById("vokabel-liste");
    liste.innerHTML = "";

    vokabeln.forEach(vokabel => {
        const [id, wort, genus, uebersetzungRu, uebersetzungEn] = vokabel;
        const zeile = document.createElement("tr");

        // textContent statt innerHTML: verhindert, dass Eingaben als HTML interpretiert werden
        [wort, genus, uebersetzungRu ?? "-", uebersetzungEn ?? "-"].forEach(text => {
            const zelle = document.createElement("td");
            zelle.textContent = text;
            zeile.appendChild(zelle);
        });

        const aktionen = document.createElement("td");
        const loeschenButton = document.createElement("button");
        loeschenButton.textContent = "Löschen";
        loeschenButton.addEventListener("click", () => vokabelLoeschen(id));
        aktionen.appendChild(loeschenButton);
        zeile.appendChild(aktionen);

        liste.appendChild(zeile);
    });
}

async function vokabelLoeschen(id) {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    vokabelnLaden();
}

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const ru = ruFeld.value.trim();
    const en = enFeld.value.trim();

    if (!ru && !en) {
        ruFeld.setCustomValidity("Bitte genau eine Übersetzung eingeben.");
        ruFeld.reportValidity();
        return;
    }
    if (ru && en) {
        ruFeld.setCustomValidity("Bitte nur eine Übersetzung eingeben.");
        ruFeld.reportValidity();
        return;
    }
    ruFeld.setCustomValidity("");

    const neueVokabel = {
        wort: document.getElementById("wort").value,
        genus: document.getElementById("genus").value,
        uebersetzung_ru: ru || "-",
        uebersetzung_en: en || "-"
    };

    // Der Code schickt die neue Vokabel als JSON per Post an den FASTAPI-Backend
    await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(neueVokabel)
    });

    form.reset();
    vokabelnLaden();
});

vokabelnLaden();