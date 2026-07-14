export interface PhotoInfo {
  path: string;
  filename: string;
  current_date: string | null;
}

export interface ApplyDateRequest {
  paths: string[];
  new_datetime: string;
  pro_mode: boolean;
  interval_seconds: number;
}