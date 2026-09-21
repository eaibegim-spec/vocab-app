from fastapi import FastAPI
from pydantic import BaseModel
import mysql.connector


app = FastAPI()

def get_connection():
    return mysql.connector.connect(
        host="localhost",
        user="vocab_user",
        password="test1234",
        database="vocabulary_app"
    )
# Kellner nimmt die Bestellung-Teil
@app.get("/vokabeln")
def alle_vokabeln():
    verbindung = get_connection()
    cursor = verbindung.cursor()
    cursor.execute("SELECT * FROM vokabeln")
    ergebnis = cursor.fetchall()
    cursor.close()
    verbindung.close()
    return ergebnis 
class Vokabel(BaseModel):
    wort: str
    genus: str
    uebersetzung: str

@app.post("/vokabeln")
def vokabel_hinzufuegen(vokabel: Vokabel):
    verbindung = get_connection()
    cursor = verbindung.cursor()
    cursor.execute(
        "INSERT INTO vokabeln (wort, genus, uebersetzung) VALUES (%s, %s, %s)",
        (vokabel.wort, vokabel.genus, vokabel.uebersetzung)
    )
    verbindung.commit()
    neue_id = cursor.lastrowid
    cursor.close()
    verbindung.close()
    return {"id": neue_id, **vokabel.dict()}

@app.put("/vokabeln/{vokabel_id}")
def vokabel_bearbeiten(vokabel_id: int, vokabel: Vokabel):
    verbindung = get_connection()
    cursor = verbindung.cursor()
    cursor.execute(
        "UPDATE vokabeln SET wort = %s, genus = %s, uebersetzung = %s WHERE id = %s",
        (vokabel.wort, vokabel.genus, vokabel.uebersetzung, vokabel_id)
    )
    verbindung.commit()
    cursor.close()
    verbindung.close()
    return {"id": vokabel_id, **vokabel.dict()}

@app.delete("/vokabeln/{vokabel_id}")
def vokabel_loeschen(vokabel_id: int):
    verbindung = get_connection()
    cursor = verbindung.cursor()
    cursor.execute("DELETE FROM vokabeln WHERE id = %s", (vokabel_id,))
    verbindung.commit()
    cursor.close()
    verbindung.close()
    return {"gelöscht": vokabel_id}
