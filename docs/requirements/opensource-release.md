# Open-Source-Release auf GitHub
Datum: 2026-07-14
Status: draft

## Was
Das Tauri-Projekt "Datedrop" als öffentliches Open-Source-Repo auf GitHub
veröffentlichen, inkl. automatisiertem Windows-Build & Release-Pipeline
(analog zu Markpad).

## Warum
Projekt soll frei nutzbar/einsehbar sein, ohne dass Releases manuell gebaut
und hochgeladen werden müssen.

## Entscheidungen (bereits getroffen)
- Lizenz: MIT
- Repo-Name: `datedrop` (neues, eigenständiges Repo — alte Python-Version
  bleibt unveröffentlicht)
- CI/Release: automatisiert via GitHub Actions + `tauri-apps/tauri-action`,
  ausgelöst durch Git-Tag (z.B. `v0.1.0`)

## Akzeptanzkriterien
- [ ] Scaffold-Platzhalternamen bereinigt:
  - `tauri.conf.json`: `productName` → "Datedrop", `identifier` →
    `com.janke.datedrop`, Fenstertitel → "Datedrop"
  - `src-tauri/Cargo.toml`: `package.name` → "datedrop", `lib.name` →
    "datedrop_lib" (Rust-Konvention: Bindestrich im Package, Unterstrich im
    Lib-Namen)
  - `package.json`: `name` → "datedrop"
- [ ] `LICENSE`-Datei (MIT, mit Copyright-Jahr/Name) im Root
- [ ] `README.md` ersetzt Vite-Template-Text: Projektbeschreibung,
  Screenshot(s), Funktionsumfang, Installations-/Download-Anleitung,
  Hinweis auf unsignierte .exe (SmartScreen-Warnung), Build-from-source-Anleitung
- [ ] `.gitignore` geprüft (node_modules, dist, target, gen/schemas —
  bereits vorhanden) und `_reference/` bewusst behalten oder entfernen
- [ ] Lokales Git-Repo initialisiert (`git init`), sauberer erster Commit
- [ ] GitHub-Repo `datedrop` öffentlich angelegt (`gh repo create`, `gh` ist
  bereits installiert & eingeloggt als Numb006)
- [ ] GitHub Actions Workflow `ci.yml`: bei jedem Push/PR — `npm run build`
  (tsc + vite) und `cargo check` in `src-tauri/`
- [ ] GitHub Actions Workflow `release.yml`: bei Tag `v*` — baut via
  `tauri-apps/tauri-action` NSIS-Installer (.exe) + .msi für Windows und
  hängt sie automatisch an ein GitHub Release
- [ ] Erster Tag (`v0.1.0`) gepusht, Release-Workflow einmal erfolgreich
  durchgelaufen, Artefakte im Release sichtbar

## Out of scope
- Code Signing (kein Zertifikat vorhanden — bekanntes Learning aus
  `../../../Datedrop/docs/requirements/exe-release.md`)
- macOS/Linux-Builds (siehe `tauri-rewrite.md`: vorerst nicht geplant)
- Auto-Updater (`tauri-plugin-updater`)
- CONTRIBUTING.md / CODE_OF_CONDUCT.md (nur bei Bedarf für externe Beiträge)

## Offene Fragen
- [ ] `_reference/photo_dater.py.ref` + `_reference/docs/` mitveröffentlichen
  oder vor dem ersten Commit entfernen?
- [ ] Erste Versionsnummer: `v0.1.0` (Pre-Release-Signal) oder `v1.0.0`?
- [ ] Copyright-Name in der LICENSE-Datei (echter Name oder GitHub-Handle
  "Numb006")?