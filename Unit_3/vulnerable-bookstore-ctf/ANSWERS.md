## Aufgaben

### Aufgabe 1: Login untersuchen

- Öffne `/login`
- Teste verschiedene Benutzernamen und Passwörter
- Dokumentiere die Fehlermeldungen genau
- Finde heraus, ob man erkennen kann, ob ein Benutzername existiert
- Logge dich mit einem gültigen Benutzer ein
- Dokumentiere die gefundene Flag
- Prüfe mit ZAP scan was es alles gibt

Nachricht ist generisch gehalten "Benutzername oder Passwort falsch
", gibt keinen hinweis ob der Nutzer existiert.

On Submit Form Page Reload - man sieht wenig in der Antwort, dem Request

Flag: Info box mit inhalt "FLAG{LOGIN_ENUMERATION_ERFOLGREICH} gefunden"

Security Header Warnungen:
* Absence of Anti-CSRF Tokens
* CSP: Failure to Define Directive with No Fallback 
* Content Security Policy (CSP) Header Not Set
* Missing Anti-clickjacking Header
* Server Leaks Information via "X-Powered-By" HTTP Response Header Field(s)
* X-Content-Type-Options Header Missing

---

### Aufgabe 2: OWASP ZAP Scan

- Starte OWASP ZAP
- Scanne `http://localhost:3000`
- Prüfe alle gefundenen Pfade und Dateien
- Suche nach öffentlich erreichbaren Backup-Dateien
- Dokumentiere die gefundene Benutzerdatei und ihren Inhalt
- Dokumentiere die Flag aus der Flag-Datei

Keine Sitemap
Robots.txt enthält den pfad zum backup
http://localhost:3000/backup/users.json öffentliche backup datei

Flag File, `/backup/flag.txt`, nicht gefunden.

---

### Aufgabe 3: SQL Injection

- Öffne die Büchersuche unter `/books`
- Analysiere den Suchendpunkt `/books/search?q=`
- Prüfe, ob SQL Injection möglich ist (Fehlermeldungen beobachten)
- Finde heraus, welche Tabellen in der Datenbank vorhanden sind
- Lies den Inhalt der `flags`-Tabelle aus
- Dokumentiere Vorgehen und gefundene Flag

Fehler Nachricht gibt zu viel preis, verrät die Schwachstelle
>  ⚠ Fehler: SQL Fehler: SQLITE_ERROR: near "' or true%'": syntax error

statement; 3' UNION SELECT *, '1', '2' from flags; --

---

### Aufgabe 4: Reflected XSS

- Öffne die XSS-Demo unter `/xss`
- Teste den `message`-Parameter auf ungefilterte Ausgabe
- Löse einen JavaScript-Alert aus
- Dokumentiere die Schwachstelle

``http://localhost:3000/xss?message=%3Cscript%3Ealert%28%22bob%22%29%3C%2Fscript%3E``

---

### Aufgabe 5: Information Disclosure

- Öffne `/debug/error`
- Dokumentiere, welche technischen Informationen sichtbar sind
- Beurteile das Risiko dieser Informationen

---

### Aufgabe 6: Dokumentation

Dokumentiert eure Findings in folgender Tabelle:

| ID | Schwachstelle | URL | Nachweis | Risiko | Massnahme |
|---|---|---|---|---|---|
| 1 | Login Enumeration | /login | | Hoch | |
| 2 | Sensitive File Exposure | /backup/ | | Hoch | |
| 3 | SQL Injection | /books/search | | Kritisch | |
| 4 | Reflected XSS | /xss | | Hoch | |
| 5 | Information Disclosure | /debug/error | | Mittel | |

---

## Regeln

- Nur lokal auf `http://localhost:3000` testen
- Keine fremden Systeme oder Netzwerke scannen
- Keine produktiven Daten verwenden
- Keine destruktiven SQL-Befehle (DROP, DELETE, UPDATE)
- Keine Denial-of-Service-Tests

---

## Flags-Übersicht

| # | Flag | Fundort |
|---|---|---|
| 1 | FLAG{LOGIN_ENUMERATION_ERFOLGREICH} | Dashboard nach Login |
| 2 | FLAG{USER_DATEI_GEFUNDEN} | /backup/flag.txt |
| 3 | FLAG{SQL_INJECTION_ERFOLGREICH} | Büchersuche via SQL Injection |
| 4 | FLAG{XSS_ERFOLGREICH} | XSS-Demo (selbst im Alert ausgeben) |
