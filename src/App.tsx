import { useState, useRef } from "react";
import { invoke } from "@tauri-apps/api/core";
import { ask } from "@tauri-apps/plugin-dialog";
import { DropZone } from "@/components/DropZone";
import { FileTable } from "@/components/FileTable";
import { DateControls } from "@/components/DateControls";
import { TitleBar } from "@/components/TitleBar";
import type { PhotoInfo } from "@/types";
import "./App.css";

function todayString() {
  return new Date().toISOString().slice(0, 10);
}

export default function App() {
  const [files, setFiles] = useState<PhotoInfo[]>([]);
  const [date, setDate] = useState(todayString());
  const [hours, setHours] = useState("12");
  const [minutes, setMinutes] = useState("00");
  const [proMode, setProMode] = useState(false);
  const [intervalSeconds, setIntervalSeconds] = useState(1);
  const [status, setStatus] = useState("Bereit.");
  const [isScrolled, setIsScrolled] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  async function handleFiles(paths: string[]) {
    setStatus("Lese Dateien…");
    const infos: PhotoInfo[] = await invoke("read_photo_info", { paths });
    setFiles((prev) => {
      const existing = new Set(prev.map((f) => f.path));
      return [...prev, ...infos.filter((f) => !existing.has(f.path))];
    });
    setStatus(`${infos.length} Datei(en) geladen.`);
  }

  async function handleApply() {
    if (files.length === 0) return;
    const h = hours.padStart(2, "0");
    const m = minutes.padStart(2, "0");
    const new_datetime = `${date}T${h}:${m}:00`;

    const confirmed = await ask(
      `Datum ${date} ${h}:${m} auf ${files.length} ${files.length === 1 ? "Datei" : "Dateien"} anwenden?`,
      { title: "Bestätigung", kind: "warning" }
    );
    if (!confirmed) return;
    setStatus("Wende Datum an…");
    try {
      await invoke("apply_date", {
        request: {
          paths: files.map((f) => f.path),
          new_datetime,
          pro_mode: proMode,
          interval_seconds: intervalSeconds,
        },
      });
      setStatus(`Datum angewendet auf ${files.length} ${files.length === 1 ? "Datei" : "Dateien"}.`);
      const refreshed: PhotoInfo[] = await invoke("read_photo_info", {
        paths: files.map((f) => f.path),
      });
      setFiles(refreshed);
    } catch (e) {
      setStatus(`Fehler: ${e}`);
    }
  }

  function handleReset() {
    setFiles([]);
    setDate(todayString());
    setHours("12");
    setMinutes("00");
    setProMode(false);
    setIntervalSeconds(1);
    setStatus("Bereit.");
  }

  return (
    <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden">
      {/* TitleBar — fest oben */}
      <TitleBar title="Datedrop" isScrolled={isScrolled} onReset={handleReset} />

      {/* DropZone — fest, kein Scroll */}
      <div className="px-3 pt-2 pb-2 shrink-0">
        <DropZone onFiles={handleFiles} />
      </div>

      {/* Tabelle — nimmt restlichen Platz, nur hier scrollt es vertikal */}
      <div
        ref={scrollRef}
        className="flex-1 mx-3 mb-2 border border-border/60 rounded-md overflow-y-auto overflow-x-hidden min-h-0 bg-card shadow-sm"
        onScroll={(e) => setIsScrolled((e.target as HTMLElement).scrollTop > 0)}
      >
        <FileTable files={files} onReorder={setFiles} />
      </div>

      {/* DateControls — fest unten */}
      <DateControls
        date={date}
        hours={hours}
        minutes={minutes}
        proMode={proMode}
        intervalSeconds={intervalSeconds}
        onDateChange={setDate}
        onHoursChange={setHours}
        onMinutesChange={setMinutes}
        onProModeChange={setProMode}
        onIntervalChange={setIntervalSeconds}
        onApply={handleApply}
      />

      {/* Statusbar — fest unten */}
      <div className="px-4 py-1.5 border-t text-xs text-muted-foreground bg-muted/30 shrink-0">
        {status}
      </div>
    </div>
  );
}