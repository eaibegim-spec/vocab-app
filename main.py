from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import mysql.connector
import random


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_connection():
    return mysql.connector.connect(
        host="localhost",
        user="vocab_user",
        password="test1234",
        database="vocabulary_app"
    )

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
    uebersetzung_ru: Optional[str] = None
    uebersetzung_en: Optional[str] = None

@app.post("/vokabeln")
def vokabel_hinzufuegen(vokabel: Vokabel):
    verbindung = get_connection()
    cursor = verbindung.cursor()
    cursor.execute(
        "INSERT INTO vokabeln (wort, genus, uebersetzung_ru, uebersetzung_en) VALUES (%s, %s, %s, %s)",
        (vokabel.wort, vokabel.genus, vokabel.uebersetzung_ru, vokabel.uebersetzung_en)
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
        "UPDATE vokabeln SET wort = %s, genus = %s, uebersetzung_ru = %s, uebersetzung_en = %s WHERE id = %s",
        (vokabel.wort, vokabel.genus, vokabel.uebersetzung_ru, vokabel.uebersetzung_en, vokabel_id)
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

@app.get("/trainer")
def trainer(nazahl: int = 3):
    verbindung = get_connection()
    cursor = verbindung.cursor()
    cursor.execute("SELECT * FROM vokabeln")
    alle_vokabeln = cursor.fetchall()
    cursor.close()
    verbindung.close()

    anzahl = min(nazahl, len(alle_vokabeln))
    return random.sample(alle_vokabeln, anzahl)

    