import { RawWeatherData, WeatherData, WeatherHour } from "../interfaces/Types";

export const crunchWeatherData = (rawWeatherData: RawWeatherData) => {
  let pastHourly: WeatherHour[] = [];
  let thisHour: WeatherHour | undefined = undefined;
  let hourly: WeatherHour[] = [];
  let days: WeatherHour[][] = [];
  let maxTemp = Number.MIN_VALUE;
  let minTemp = Number.MAX_VALUE;

  let lastWeatherCode = -1;
  let lastDay = -1;

  let now = Date.now();

  for (let i = 0; i < rawWeatherData.hourly.time.length; i++) {
    let time = new Date(rawWeatherData.hourly.time[i] * 1000);
    let weatherCode = rawWeatherData.hourly.weathercode[i];

    let newDay = false;
    if (time.getDate() !== lastDay) {
      newDay = true;
      days.push([]);
      lastDay = time.getDate();
    }

    let newWeather = false;
    if (weatherCode != lastWeatherCode) {
      newWeather = true;
      lastWeatherCode = weatherCode;
    }

    let tense = "future";
    if (now - 60 * 60 * 1000 > time.getTime()) {
      tense = "past";
    } else if (now > time.getTime()) {
      tense = "now";
    }

    let hour: WeatherHour = {
      tempUnit: rawWeatherData.hourly_units.apparent_temperature,
      precipitationUnit: rawWeatherData.hourly_units.precipitation,
      feelLikeTemp: rawWeatherData.hourly.apparent_temperature[i],
      temp: rawWeatherData.hourly.temperature_2m[i],
      cloudCover: rawWeatherData.hourly.cloudcover[i],
      dewPoint: rawWeatherData.hourly.dewpoint_2m[i],
      relativeHumidity: rawWeatherData.hourly.relativehumidity_2m[i],
      windSpeed: rawWeatherData.hourly.windspeed_10m[i],
      precipitation: rawWeatherData.hourly.precipitation[i],

      weatherCode: weatherCode,

      time: time,
      newDay: newDay,
      newWeather: newWeather,
      tense: tense,
    };


    if (hour.temp > maxTemp) maxTemp = hour.temp;
    if (hour.temp < minTemp) minTemp = hour.temp;

    if (now > hour.time.getTime()) {
      pastHourly.push(hour);
    } else if (now + 60 * 60 * 1000 > hour.time.getTime()) {
      thisHour = hour;
    } else {
      hourly.push(hour);
    }
    days[days.length - 1].push(hour);
  }
  console.log(minTemp, maxTemp);

  const outcome: WeatherData = {
    pastHourly: pastHourly,
    thisHour: thisHour,
    hourly: hourly,
    days: days,
    maxTemp: maxTemp,
    minTemp: minTemp,
  };

  return outcome;
};
