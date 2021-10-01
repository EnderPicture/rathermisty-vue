export interface RawWeatherData {
  utc_offset_seconds: number;
  longitude: number;
  elevation: number;
  latitude: number;
  current_weather: CurrentWeather;
  hourly: Hourly;
  hourly_units: HourlyUnits;
  generationtime_ms: number;
}

export interface CurrentWeather {
  temperature: number;
  time: number;
  winddirection: number;
  windspeed: number;
  weathercode: number;
}

export interface Hourly {
  relativehumidity_2m: number[];
  weathercode: number[];
  cloudcover: number[];
  windspeed_10m: number[];
  apparent_temperature: number[];
  time: number[];
  dewpoint_2m: number[];
  temperature_2m: number[];
}

export interface HourlyUnits {
  relativehumidity_2m: string;
  weathercode: string;
  cloudcover: string;
  windspeed_10m: string;
  apparent_temperature: string;
  time: string;
  dewpoint_2m: string;
  temperature_2m: string;
}

export interface WeatherHour {
  tempUnit: string;
  feelLikeTemp: number;
  temp: number;
  weatherCode: number;
  time: Date;
  newDay: boolean;
  newWeather: boolean;
  tense: string;
}
