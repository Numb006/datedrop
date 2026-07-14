import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

interface Props {
  date: string;
  hours: string;
  minutes: string;
  proMode: boolean;
  intervalSeconds: number;
  onDateChange: (v: string) => void;
  onHoursChange: (v: string) => void;
  onMinutesChange: (v: string) => void;
  onProModeChange: (v: boolean) => void;
  onIntervalChange: (v: number) => void;
  onApply: () => void;
}

export function DateControls({
  date, hours, minutes, proMode, intervalSeconds,
  onDateChange, onHoursChange, onMinutesChange,
  onProModeChange, onIntervalChange, onApply,
}: Props) {
  return (
    <div className="border-t bg-background px-4 py-3 space-y-3">
      <div className="flex items-center gap-4 flex-wrap">
        <Label className="font-semibold whitespace-nowrap">Neues Datum:</Label>
        <Input
          type="date"
          value={date}
          onChange={(e) => onDateChange(e.target.value)}
          className="w-40"
        />
        <Label className="font-semibold">Uhrzeit:</Label>
        <div className="flex items-center gap-1">
          <Input
            type="number"
            min={0}
            max={23}
            value={hours}
            onChange={(e) => onHoursChange(e.target.value.padStart(2, "0"))}
            className="w-14 text-center"
          />
          <span className="font-bold">:</span>
          <Input
            type="number"
            min={0}
            max={59}
            value={minutes}
            onChange={(e) => onMinutesChange(e.target.value.padStart(2, "0"))}
            className="w-14 text-center"
          />
        </div>
        <Button onClick={onApply} className="bg-green-600 hover:bg-green-700 text-white ml-auto">
          ✓ Datum anwenden
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <Switch checked={proMode} onCheckedChange={onProModeChange} />
        <Label className="text-sm">Profi-Modus</Label>
        {proMode && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Datum pro Foto um</span>
            <Input
              type="number"
              min={1}
              value={intervalSeconds}
              onChange={(e) => onIntervalChange(Number(e.target.value))}
              className="w-16 text-center"
            />
            <span>Sekunden erhöhen</span>
          </div>
        )}
      </div>
    </div>
  );
}