import { useEffect, useRef, useState } from "react";
import { open } from "@tauri-apps/plugin-dialog";
import { getCurrentWebview } from "@tauri-apps/api/webview";

interface Props {
  onFiles: (paths: string[]) => void;
}

const ACCEPTED = new Set([
  "jpg","jpeg","png","gif","bmp","tiff","tif",
  "webp","heic","heif","raw","cr2","nef","arw",
  "mp4","mov","avi","mkv",
]);

function filterPaths(paths: string[]) {
  return paths.filter((p) => {
    const ext = p.split(".").pop()?.toLowerCase() ?? "";
    return ACCEPTED.has(ext);
  });
}

export function DropZone({ onFiles }: Props) {
  const [isDragOver, setIsDragOver] = useState(false);
  const onFilesRef = useRef(onFiles);
  onFilesRef.current = onFiles;

  useEffect(() => {
    let unlisten: (() => void) | undefined;

    try {
      getCurrentWebview()
        .onDragDropEvent((event) => {
          if (event.payload.type === "over") {
            setIsDragOver(true);
          } else if (event.payload.type === "drop") {
            setIsDragOver(false);
            const paths = filterPaths(event.payload.paths);
            if (paths.length > 0) onFilesRef.current(paths);
          } else {
            setIsDragOver(false);
          }
        })
        .then((fn) => { unlisten = fn; });
    } catch {
      // nicht im Tauri-Fenster (z.B. Browser-Dev-Mode)
    }

    return () => { unlisten?.(); };
  }, []);

  async function handleClick() {
    const selected = await open({
      multiple: true,
      filters: [{ name: "Fotos & Videos", extensions: [...ACCEPTED] }],
    });
    if (selected) {
      const paths = Array.isArray(selected) ? selected : [selected];
      onFiles(paths);
    }
  }

  return (
    <div
      onClick={handleClick}
      className={[
        "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors select-none",
        isDragOver
          ? "border-blue-500 bg-blue-100"
          : "border-blue-300 bg-blue-50/50 hover:bg-blue-50 hover:border-blue-400",
      ].join(" ")}
    >
      <span className="text-blue-600 font-medium">↓ Fotos hier hineinziehen</span>
      <span className="text-muted-foreground mx-2">·</span>
      <span className="text-blue-600 font-medium">oder klicken zum Auswählen</span>
    </div>
  );
}