# Datedrop

Small Windows tool to retroactively set the capture date (EXIF) and file
system timestamp of photos/videos via drag & drop.

Rewrite of the original Python/CustomTkinter tool as a native
Tauri + React desktop app.

## Features

- Drag & drop photos/videos (or pick them via a file dialog)
- Table with filename, current date, and order (sortable by drag)
- Set a new date + time for all selected files
- Pro mode: increment the date per file by X seconds (for burst shots)
- EXIF date and file system timestamp are updated together
- Double-click opens the file in the default program

## Download

Prebuilt Windows binaries are available under
[Releases](https://github.com/Numb006/datedrop/releases).

> **Note:** The app is currently unsigned. Windows SmartScreen will show a
> warning ("Unrecognized app") on first launch. Click
> **More info → Run anyway** to start it normally. This only happens once.

## Building from source

Requirements: [Node.js](https://nodejs.org/) (LTS) and
[Rust](https://www.rust-lang.org/tools/install).

```bash
npm install
npm run tauri dev    # development mode
npm run tauri build  # production build (.exe/.msi under src-tauri/target/release/bundle)
```

## Tech stack

- Frontend: React + TypeScript + Vite, shadcn/ui + Tailwind CSS
- Backend: Tauri v2 (Rust)
- EXIF handling: `kamadak-exif`

## Platform

Windows only for now. macOS/Linux are untested and not currently planned.

## License

[MIT](LICENSE)