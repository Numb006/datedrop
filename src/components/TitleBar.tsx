import { getCurrentWindow } from "@tauri-apps/api/window";

const isMac = typeof navigator !== "undefined" && navigator.userAgent.includes("Macintosh");

function getWindow() {
  try { return getCurrentWindow(); } catch { return null; }
}

function winClose()          { getWindow()?.close(); }
function winMinimize()       { getWindow()?.minimize(); }
function winMaximize()       { getWindow()?.toggleMaximize(); }

interface Props {
  title?: string;
  isScrolled?: boolean;
  onReset?: () => void;
}

export function TitleBar({ title = "Foto-Datierung", isScrolled = false, onReset }: Props) {
  return (
    <>
      <div
        data-tauri-drag-region
        className={[
          "h-9 flex items-center justify-between shrink-0 select-none",
          "bg-[var(--titlebar-bg)] transition-[border-color] duration-200",
          isScrolled ? "border-b border-border" : "border-b border-transparent",
        ].join(" ")}
        style={{ fontFamily: "'Segoe UI Variable Display', 'Segoe UI', system-ui, sans-serif" }}
      >
        {/* Linke Seite */}
        <div data-tauri-drag-region className="flex items-center pl-3 h-full">
          {isMac ? (
            <TrafficLights />
          ) : (
            <span data-tauri-drag-region className="text-sm opacity-60 pr-2">📅</span>
          )}
        </div>

        {/* Titel — zentriert, pointer-events none damit Drag durchgeht */}
        <div data-tauri-drag-region className="absolute inset-x-0 top-0 h-9 flex items-center justify-center pointer-events-none">
          <span className="text-xs text-[var(--titlebar-fg-muted)] truncate max-w-[50%]">
            {title}
          </span>
        </div>

        {/* Rechte Seite */}
        <div data-tauri-drag-region className="flex items-center h-full gap-1 pr-2">
          {onReset && (
            <button
              onClick={onReset}
              className="h-6 px-2 text-xs rounded text-destructive hover:bg-destructive/10 transition-colors border border-destructive/30"
            >
              ↺ Reset
            </button>
          )}
          {!isMac && <WindowControls />}
        </div>
      </div>
    </>
  );
}

function TrafficLights() {
  return (
    <div className="flex items-center gap-2 mr-2 group">
      <TrafficLight
        color="#ff5f57" border="#e0443e"
        onClick={() => winClose()}
        label="Schließen"
        icon={<path d="M0.5 0.5L5.5 5.5M5.5 0.5L0.5 5.5" stroke="#4d0000" strokeWidth="1.2" strokeLinecap="round" />}
      />
      <TrafficLight
        color="#febc2e" border="#d3a125"
        onClick={() => winMinimize()}
        label="Minimieren"
        icon={<path d="M0.5 3H5.5" stroke="#995700" strokeWidth="1.2" strokeLinecap="round" />}
      />
      <TrafficLight
        color="#28c840" border="#1ca431"
        onClick={() => winMaximize()}
        label="Maximieren"
        icon={<path d="M0.5 3H5.5M3 0.5V5.5" stroke="#006500" strokeWidth="1.2" strokeLinecap="round" />}
      />
    </div>
  );
}

function TrafficLight({ color, border, onClick, label, icon }: {
  color: string; border: string; onClick: () => void; label: string; icon: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="w-3 h-3 rounded-full flex items-center justify-center cursor-default outline-none"
      style={{ backgroundColor: color, border: `1px solid ${border}`, flexShrink: 0 }}
    >
      <svg width="6" height="6" viewBox="0 0 6 6" className="opacity-0 group-hover:opacity-70 transition-opacity">
        {icon}
      </svg>
    </button>
  );
}

function WindowControls() {
  return (
    <div className="flex h-9 -mr-2">
      <WinBtn onClick={() => winMinimize()} label="Minimieren">
        <svg width="12" height="12" viewBox="0 0 12 12">
          <rect fill="currentColor" width="10" height="1" x="1" y="6" />
        </svg>
      </WinBtn>
      <WinBtn onClick={() => winMaximize()} label="Maximieren">
        <svg width="12" height="12" viewBox="0 0 12 12">
          <rect fill="none" stroke="currentColor" strokeWidth="1" width="9" height="9" x="1.5" y="1.5" />
        </svg>
      </WinBtn>
      <WinBtn onClick={() => winClose()} label="Schließen" isClose>
        <svg width="12" height="12" viewBox="0 0 12 12">
          <path fill="currentColor" d="M11 1.7L10.3 1 6 5.3 1.7 1 1 1.7 5.3 6 1 10.3 1.7 11 6 6.7 10.3 11 11 10.3 6.7 6z" />
        </svg>
      </WinBtn>
    </div>
  );
}

function WinBtn({ onClick, label, isClose = false, children }: {
  onClick: () => void; label: string; isClose?: boolean; children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={[
        "w-11 h-9 flex items-center justify-center border-none cursor-default transition-colors duration-100",
        "text-[var(--titlebar-fg)] opacity-75 hover:opacity-100",
        isClose ? "hover:bg-[#e81123] hover:text-white" : "hover:bg-[var(--titlebar-btn-hover)]",
      ].join(" ")}
    >
      {children}
    </button>
  );
}