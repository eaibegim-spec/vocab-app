const API_URL = "http://localhost:8000/vokabeln";

async function vokabelnLaden() {
    const antwort = await fetch(API_URL);
    const vokabeln = await antwort.json();
    vokabelnCache = vokabeln; 

    const liste = document.getElementById("vokabel-liste");
    liste.innerHTML = "";

    vokabeln.forEach(vokabel => {
        const [id, wort, genus, uebersetzungRu, uebersetzungEn] = vokabel;
        const zeile = document.createElement("tr");
        zeile.innerHTML = `
            <td>${wort}</td>
            <td>${genus}</td>
            <td>${uebersetzungRu ?? "-"}</td>
            <td>${uebersetzungEn ?? "-"}</td>
            <td><button onclick="vokabelLöschen(${id})">Löschen</button></td>
        `;
        liste.appendChild(zeile);
    });
}

async function vokabelLoeschen(id) {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    vokabelnLaden();
}

function vokabelBearbeiten(id) {
    const eintrag = vokabelnCache.find(v => v[0] === id);
    if (!eintrag) return;
    const [, wort, genus, ru, en] = eintrag;

    document.getElementById("wort").value = wort;
    document.getElementById("genus").value = genus;
    document.getElementById("uebersetzung_ru").value = ru === "-" ? "" : ru;
    document.getElementById("uebersetzung_en").value = en === "-" ? "" : en;
}

document.getElementById("vokabel-form").addEventListener("submit", async (event) => {
    event.preventDefault();

    const ruFeld = document.getElementById("uebersetzung_ru");
    const enFeld = document.getElementById("uebersetzung_en");
    const ru = ruFeld.value.trim();
    const en = enFeld.value.trim();

    if (!ru && !en) {
        ruFeld.setCustomValidity("Bitte genau eine Übersetzung eingeben.");
        ruFeld.reportValidity();
        return;
    }
    if (ru && en) {
        ruFeld.setCustomValidity("Bitte nur eine Übersetzung eingeben, nicht beide.");
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

    const url = editId ? `${API_URL}/${editId}` : API_URL;
    const methode = editId ? "PUT" : "POST";

    await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(neueVokabel)
    });

    document.getElementById("vokabel-form").reset();
    vokabelnLaden();
});

vokabelnLaden();