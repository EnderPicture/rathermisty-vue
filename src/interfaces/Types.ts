export interface RawWeatherData {
  hourly: Hourly;
  hourly_units: HourlyUnits;
  generationtime_ms: number;
  utc_offset_seconds: number;
  elevation: number;
  latitude: number;
  longitude: number;
  current_weather: CurrentWeather;
}

export interface CurrentWeather {
  winddirection: number;
  weathercode: number;
  temperature: number;
  time: number;
  windspeed: number;
}

export interface Hourly {
  apparent_temperature: number[];
  dewpoint_2m: number[];
  windspeed_10m: number[];
  time: number[];
  precipitation: number[];
  temperature_2m: number[];
  relativehumidity_2m: number[];
  cloudcover: number[];
  weathercode: number[];
}

export interface HourlyUnits {
  apparent_temperature: string;
  dewpoint_2m: string;
  windspeed_10m: string;
  temperature_2m: string;
  time: string;
  precipitation: string;
  relativehumidity_2m: string;
  cloudcover: string;
  weathercode: string;
}

export interface WeatherDay {
  tense: string;
  minTemp: number;
  maxTemp: number;
  minApparentTemp: number;
  maxApparentTemp: number;
  hours: WeatherHour[];
}
export interface WeatherHour {
  tempUnit: string;
  apparentTemp: number;
  temp: number;
  weatherCode: number;
  time: Date;
  newDay: boolean;
  newWeather: boolean;
  tense: string;

  cloudCover: number;
  dewPoint: number;
  relativeHumidity: number;
  windSpeed: number;
  precipitation: number;
  precipitationUnit: string;
}

export interface WeatherData {
  days: WeatherDay[];
  maxTemp: number;
  minTemp: number;
}
