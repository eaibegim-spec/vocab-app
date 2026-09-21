import mysql.connector

verbindung = mysql.connector.connect(
    host="localhost",
    user="vocab_user",
    password="test1234",
    database="vocabulary_app"
)

cursor = verbindung.cursor()

cursor.execute(
    "INSERT INTO vokabeln (wort, genus, uebersetzung) VALUES (%s, %s, %s)",
    ("Haus", "das", "house")
)
verbindung.commit()

cursor.execute("SELECT * FROM vokabeln")
for zeile in cursor.fetchall():
    print(zeile)

cursor.close()
verbindung.close()

