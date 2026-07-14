# Datedrop

Kleines Windows-Tool zum nachträglichen Setzen von Aufnahmedatum (EXIF) und
Dateisystem-Zeitstempel bei Fotos/Videos per Drag & Drop.

Rewrite des ursprünglichen Python/CustomTkinter-Tools als natives
Tauri + React Desktop-App.

## Funktionen

- Drag & Drop von Fotos/Videos (oder Auswahl per Dateidialog)
- Tabelle mit Dateiname, aktuellem Datum und Reihenfolge (per Drag sortierbar)
- Neues Datum + Uhrzeit für alle ausgewählten Dateien setzen
- Profi-Modus: Datum pro Datei um X Sekunden erhöhen (für Serienaufnahmen)
- EXIF-Datum und Dateisystem-Zeitstempel werden gemeinsam aktualisiert
- Doppelklick öffnet die Datei im Standardprogramm

## Download

Fertige Windows-Builds gibt es unter
[Releases](https://github.com/Numb006/datedrop/releases).

> **Hinweis:** Die App ist aktuell unsigniert. Windows SmartScreen zeigt beim
> ersten Start eine Warnung ("Nicht erkannte App"). Über
> **Weitere Informationen → Trotzdem ausführen** startet die App normal.
> Das ist einmalig.

## Aus dem Quellcode bauen

Voraussetzungen: [Node.js](https://nodejs.org/) (LTS) und
[Rust](https://www.rust-lang.org/tools/install).

```bash
npm install
npm run tauri dev    # Entwicklungsmodus
npm run tauri build  # Produktions-Build (.exe/.msi unter src-tauri/target/release/bundle)
```

## Tech-Stack

- Frontend: React + TypeScript + Vite, shadcn/ui + Tailwind CSS
- Backend: Tauri v2 (Rust)
- EXIF-Handling: `kamadak-exif`

## Plattform

Aktuell nur Windows. macOS/Linux sind nicht getestet und derzeit nicht geplant.

## Lizenz

[MIT](LICENSE)