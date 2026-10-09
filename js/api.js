const Api = {
    URL: "http://localhost:8000",

    // Wandelt die Rohdaten [id, wort, genus, ru, en] in ein sprechendes Objekt um.
    // Neue Modi arbeiten nur noch mit diesem Format.
    async holeKarten(anzahl) {
        const antwort = await fetch(`${this.URL}/trainer?anzahl=${anzahl}`);
        if (!antwort.ok) throw new Error("Server-Fehler " + antwort.status);
        const zeilen = await antwort.json();
        return zeilen.map(([id, wort, genus, ru, en]) => ({
            id,
            wort,
            genus: genus !== "-" ? genus : "",
            uebersetzung: ru !== "-" ? ru : en,
            ru,
            en,
        }));
    },
};