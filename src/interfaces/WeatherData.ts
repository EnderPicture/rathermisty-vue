export interface WeatherData {
  hourly_units: HourlyUnits;
  elevation: number;
  utc_offset_seconds: number;
  latitude: number;
  longitude: number;
  hourly: Hourly;
  generationtime_ms: number;
}

export interface Hourly {
  time: string[];
  apparent_temperature: number[];
  temperature_2m: number[];
  weathercode: number[];
}

export interface HourlyUnits {
  weathercode: string;
  apparent_temperature: string;
  temperature_2m: string;
  time: string;
}
