import { invoke } from "@tauri-apps/api/core";
import { useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import type { PhotoInfo } from "@/types";

interface Props {
  files: PhotoInfo[];
  onReorder: (files: PhotoInfo[]) => void;
}

type SortDir = "asc" | "desc" | null;

interface RowProps {
  file: PhotoInfo;
  index: number;
  sortable: boolean;
  onDoubleClick: (path: string) => void;
}

function SortableRow({ file, index, sortable, onDoubleClick }: RowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: file.path, disabled: !sortable });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      onDoubleClick={() => onDoubleClick(file.path)}
      className={[
        "transition-colors hover:bg-muted/40",
        isDragging ? "opacity-0" : "",
      ].join(" ")}
    >
      <TableCell className="text-muted-foreground text-xs w-8">{index + 1}</TableCell>
      <TableCell className="text-sm font-medium">{file.filename}</TableCell>
      <TableCell className="text-sm text-muted-foreground">
        {file.current_date ?? "–"}
      </TableCell>
      <TableCell>
        {sortable && (
          <span
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground select-none px-2 py-1"
            title="Ziehen zum Sortieren"
          >
            ⠿
          </span>
        )}
      </TableCell>
    </TableRow>
  );
}

function OverlayRow({ file, index }: { file: PhotoInfo; index: number }) {
  return (
    <div className="flex items-center bg-card border border-blue-300 rounded shadow-lg text-sm px-2 py-2 gap-4 opacity-95">
      <span className="text-muted-foreground text-xs w-8 shrink-0">{index + 1}</span>
      <span className="font-medium flex-1 truncate">{file.filename}</span>
      <span className="text-muted-foreground shrink-0">{file.current_date ?? "–"}</span>
      <span className="text-muted-foreground px-2">⠿</span>
    </div>
  );
}

export function FileTable({ files, onReorder }: Props) {
  const [sortDir, setSortDir] = useState<SortDir>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  async function handleDoubleClick(path: string) {
    await invoke("open_file", { path });
  }

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveId(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = files.findIndex((f) => f.path === active.id);
    const newIndex = files.findIndex((f) => f.path === over.id);
    onReorder(arrayMove(files, oldIndex, newIndex));
  }

  function toggleSort() {
    setSortDir((prev) => (prev === null ? "asc" : prev === "asc" ? "desc" : null));
  }

  const displayFiles = sortDir
    ? [...files].sort((a, b) => {
        const cmp = a.filename.localeCompare(b.filename, "de", { sensitivity: "base" });
        return sortDir === "asc" ? cmp : -cmp;
      })
    : files;

  const sortIcon = sortDir === "asc" ? " ↑" : sortDir === "desc" ? " ↓" : " ↕";

  const activeFile = activeId ? files.find((f) => f.path === activeId) : null;
  const activeIndex = activeId ? files.findIndex((f) => f.path === activeId) : -1;

  if (files.length === 0) {
    return (
      <div className="flex items-center justify-center text-muted-foreground text-sm py-16">
        Noch keine Fotos – Dateien in den Bereich oben ziehen.
      </div>
    );
  }

  return (
    <div className="w-full">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-8 text-xs">#</TableHead>
              <TableHead
                className="text-xs font-semibold text-blue-600 cursor-pointer select-none hover:text-blue-800"
                onClick={toggleSort}
              >
                Dateiname{sortIcon}
              </TableHead>
              <TableHead className="text-xs">Aktuelles Datum</TableHead>
              <TableHead className="text-xs text-muted-foreground w-12">
                {sortDir ? "sortiert" : ""}
              </TableHead>
            </TableRow>
          </TableHeader>
          <SortableContext
            items={displayFiles.map((f) => f.path)}
            strategy={verticalListSortingStrategy}
          >
            <TableBody>
              {displayFiles.map((file, i) => (
                <SortableRow
                  key={file.path}
                  file={file}
                  index={i}
                  sortable={sortDir === null}
                  onDoubleClick={handleDoubleClick}
                />
              ))}
            </TableBody>
          </SortableContext>
        </Table>

        <DragOverlay dropAnimation={null}>
          {activeFile ? (
            <OverlayRow file={activeFile} index={activeIndex} />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}