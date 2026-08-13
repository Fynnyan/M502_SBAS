## Teil 1: Projekt starten
**Fragen:**

- Welche Ausgabe erscheint im Terminal nach `npm install`?
  
Mit pnpm gibt es den hinweis auf neue versionen für die packete

- Gibt es bereits beim Install Hinweise auf Sicherheitsprobleme?

Ja, pnpm, npm gibt einen hinweis zu bekannten vulnerabilities   

---

## Teil 2: Dependency Tree anzeigen

### Zusatzfragen

- Welche Packages sind **direkte** Dependencies (in `dependencies` bzw. `devDependencies` in `package.json`)?

Die welche selbst definiert wurden un im package.json definiert sind z.b. axios oder lodash

- Welche Packages sind **transitive** Dependencies (werden von anderen Packages gezogen)?

Dependencies welche von den definierten Dependencies benötigt werden. z.b. benötigt `axios` die `follow-redirects` lib   

- Was bedeutet der Hinweis `deduped`?
  
Dedupliziert, die transitive Dependency wird von mehreren Dependecnies verwended, mechanismus von npm zur optimierung

- Warum können auch transitive Dependencies ein Sicherheitsproblem darstellen, obwohl ihr sie nicht
  selbst eingebunden habt?

Können auch CVEs enthalten welche die Applikation beeinträchtigen.  

---

## Teil 3: Sicherheitsprobleme finden

### Fragen

- Welche Packages haben Sicherheitsprobleme?
  
Praktisch alle, axios am meisten. Es werden alte versionen verwendet

- Handelt es sich um **direkte** oder **transitive** Dependencies?

Hauptsächlich **direkte** dependencies

- Welche **Severity**-Stufen werden angezeigt? 
3 low | 29 moderate | 20 high
 
- Welche Advisory-Informationen (CVE, GHSA) werden pro Finding aufgeführt?

Hauptsächlich wird auf die GitHub Secuurity Advisory verlinkt
 
- Gibt es empfohlene Fixes in der Ausgabe?

Ja, es werden gepatched versionen angegeben

---

## Teil 4: Quelle und Glaubwürdigkeit bewerten

https://github.com/advisories/GHSA-c24v-8rfc-w8vw
Vite dev server option `server.fs.deny` can be bypassed when hosted on case-insensitive filesystem


https://github.com/advisories/GHSA-jr5f-v2jv-69x6
axios Requests Vulnerable To Possible SSRF and Credential Leakage via Absolute URL

### Fragen

- Woher stammt die Information (npm Advisory, GitHub Advisory, CVE)?

GitHub Advisory

- Gibt es technische Details zur Schwachstelle?

ja

- Welche **betroffenen Versionen** werden genannt?
- Welche **korrigierte Version** wird empfohlen?
- Ist die Quelle glaubwürdig? Begründet eure Einschätzung.

ja, advisories wurden von maintainern geschreiben bzw. reviewd 

---

## Teil 5: Relevanz für die Kalender-App bewerten

### Aufgabe

Bewertet, ob die gefundenen Probleme für **diese** App relevant sind.

Berücksichtigt dabei:

- Wird das betroffene Package im Code der App aktiv verwendet?
- Wird die konkret betroffene Funktion oder API verwendet?
- Läuft das Package im **Browser**, im **Build-Prozess** oder serverseitig?
- Ist die betroffene Funktion von aussen erreichbar (z. B. über eine öffentliche API)?
- Welche Daten könnten bei einer Ausnutzung betroffen sein?

### Relevanz-Einstufung

Stuft jedes Finding ein:

| Stufe | Bedeutung |
|---|---|
| **hoch** | Die Schwachstelle ist aktiv im Einsatz und potenziell ausnutzbar |
| **mittel** | Schwachstelle ist vorhanden, aber schwer ausnutzbar |
| **niedrig** | Theoretisch vorhanden, kaum realistisch ausnutzbar |
| **nicht relevant** | Package wird nicht oder nicht in der betroffenen Weise verwendet |
| **unklar** | Nicht genug Informationen für eine Einschätzung |

---

## Teil 7: Dokumentation

Erstellt eine kurze Dokumentation eurer Analyse mit folgender Tabelle.
Verwendet dafür die Vorlage in `docs/security-analysis-template.md`.

| Package | Direkt / Transitiv | Problem                                         | Quelle   | Severity | Relevanz | Massnahme          | Ergebnis |
|---------|--------------------|-------------------------------------------------|----------|----------|----------|--------------------|----------|
| axios   | Direkt             | diverse, grunsätzlich alles veraltete versionen | GHSA-xxx | High     | mittel   | Update auf 4.17.21 | behoben  |
| lodash  | Direkt             | diverse, grunsätzlich alles veraltete versionen | GHSA-xxx | High     | mittel   | Update auf 4.17.21 | behoben  |
| moment  | Direkt             | diverse, grunsätzlich alles veraltete versionen | GHSA-xxx | High     | mittel   | Update auf 4.17.21 | behoben  |
| nanoid  | Direkt             | diverse, grunsätzlich alles veraltete versionen | GHSA-xxx | High     | mittel   | Update auf 4.17.21 | behoben  |
| vite    | Direkt             | diverse, grunsätzlich alles veraltete versionen | GHSA-xxx | High     | mittel   | Update auf 4.17.21 | behoben  |


axiso und nanoid stark veralete versionen, mehrere major versions
lodash & moment einige patch versionen hintendrein

---

## Abgabe

Gebt folgendes ab:

1. Screenshot oder Textauszug von `npm ls --all`
2. Screenshot oder Textauszug von `npm audit` (vor dem Fix)
3. Ausgefüllte Bewertungstabelle (`docs/security-analysis-template.md`)
4. Kurze Begründung zur Relevanz der Findings für diese App
5. Beschreibung der durchgeführten Fixes (oder Commit-History)
6. Erneuter `npm audit`-Nachweis **nach** der Behebung
