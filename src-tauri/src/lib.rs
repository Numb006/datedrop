use chrono::{NaiveDateTime, TimeZone, Local};
use filetime::FileTime;
use serde::{Deserialize, Serialize};
use std::fs;
use std::io::BufReader;
use std::path::Path;

#[derive(Serialize, Deserialize, Clone)]
pub struct PhotoInfo {
    pub path: String,
    pub filename: String,
    pub current_date: Option<String>,
}

#[derive(Deserialize)]
pub struct ApplyDateRequest {
    pub paths: Vec<String>,
    pub new_datetime: String, // ISO: "2024-06-15T12:00:00"
    pub pro_mode: bool,
    pub interval_seconds: i64,
}

#[tauri::command]
fn read_photo_info(paths: Vec<String>) -> Vec<PhotoInfo> {
    paths
        .into_iter()
        .map(|path| {
            let filename = Path::new(&path)
                .file_name()
                .map(|n| n.to_string_lossy().into_owned())
                .unwrap_or_default();

            let current_date = read_exif_date(&path)
                .or_else(|| read_file_date(&path));

            PhotoInfo { path, filename, current_date }
        })
        .collect()
}

fn read_exif_date(path: &str) -> Option<String> {
    let file = fs::File::open(path).ok()?;
    let mut reader = BufReader::new(file);
    let exif = exif::Reader::new().read_from_container(&mut reader).ok()?;

    let field = exif.get_field(exif::Tag::DateTimeOriginal, exif::In::PRIMARY)?;
    Some(field.display_value().to_string())
}

fn read_file_date(path: &str) -> Option<String> {
    let meta = fs::metadata(path).ok()?;
    let modified = meta.modified().ok()?;
    let dt: chrono::DateTime<Local> = modified.into();
    Some(dt.format("%Y-%m-%d %H:%M:%S").to_string())
}

#[tauri::command]
fn apply_date(request: ApplyDateRequest) -> Result<Vec<String>, String> {
    let base_dt = NaiveDateTime::parse_from_str(&request.new_datetime, "%Y-%m-%dT%H:%M:%S")
        .map_err(|e| e.to_string())?;

    let mut results = Vec::new();

    for (i, path) in request.paths.iter().enumerate() {
        let offset_secs = if request.pro_mode { request.interval_seconds * i as i64 } else { 0 };
        let dt = base_dt + chrono::Duration::seconds(offset_secs);

        set_file_timestamp(path, &dt)?;
        results.push(format!("OK: {}", path));
    }

    Ok(results)
}

fn set_file_timestamp(path: &str, dt: &NaiveDateTime) -> Result<(), String> {
    let local_dt = Local.from_local_datetime(dt).single()
        .ok_or("Ungültige Zeitzone")?;
    let system_time: std::time::SystemTime = local_dt.into();
    let ft = FileTime::from_system_time(system_time);

    filetime::set_file_mtime(path, ft).map_err(|e| e.to_string())?;
    filetime::set_file_atime(path, ft).map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
fn open_file(path: String) -> Result<(), String> {
    open::that(&path).map_err(|e| e.to_string())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![read_photo_info, apply_date, open_file])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}