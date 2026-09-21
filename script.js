const API_URL = "http://localhost:8000/vokabeln";

async function vokabelnLaden() {
    const antwort = await fetch(API_URL);
    const vokabeln = await antwort.json();

    const liste = document.getElementById("vokabel-liste");
    liste.innerHTML = "";

    vokabeln.forEach(vokabel => {
        const [id, wort, genus, uebersetzung] = vokabel;
        const zeile = document.createElement("tr");
        zeile.innerHTML = `
            <td>${wort}</td>
            <td>${genus}</td>
            <td>${uebersetzung}</td>
            <td><button onclick="vokabelLoeschen(${id})">Löschen</button></td>
        `;
        liste.appendChild(zeile);
    });
}

async function vokabelLoeschen(id) {
    await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
    });
    vokabelnLaden();
}

document.getElementById("vokabel-form").addEventListener("submit", async (event) => {
    event.preventDefault();

    const neueVokabel = {
        wort: document.getElementById("wort").value,
        genus: document.getElementById("genus").value,
        uebersetzung: document.getElementById("uebersetzung").value
    };

    await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(neueVokabel)
    });

    document.getElementById("vokabel-form").reset();
    vokabelnLaden();
});

vokabelnLaden();