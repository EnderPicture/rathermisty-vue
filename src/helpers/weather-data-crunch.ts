import {
  RawWeatherData,
  WeatherData,
  WeatherHour,
  WeatherDay,
} from "../interfaces/Types";

export const crunchWeatherData = (rawWeatherData: RawWeatherData) => {
  let days: WeatherDay[] = [];

  // global max and min
  let maxTemp = Number.MIN_VALUE;
  let minTemp = Number.MAX_VALUE;
  let minApparentTemp = Number.MIN_VALUE;
  let maxApparentTemp = Number.MAX_VALUE;

  let lastWeatherCode = -1;
  let lastDay = -1;

  let now = Date.now();

  for (let i = 0; i < rawWeatherData.hourly.time.length; i++) {
    // set up day;
    let time = new Date(rawWeatherData.hourly.time[i] * 1000);
    let weatherCode = rawWeatherData.hourly.weathercode[i];

    // check if hour is a new day
    let newDay = false;
    if (time.getDate() !== lastDay) {
      newDay = true;

      let tense = "future";
      let tomorrow = new Date();
      tomorrow.setDate(time.getDate() + 7);
      if (time.getTime() < now && tomorrow.getTime() > now) {
        tense = "now";
      } else if (time.getTime() < now) {
        tense = "past";
      }
      days.push({
        tense: tense,
        minTemp: 0,
        maxTemp: 0,
        minApparentTemp: 0,
        maxApparentTemp: 0,
        hours: [],
      });
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
      apparentTemp: rawWeatherData.hourly.apparent_temperature[i],
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
    if (hour.temp > maxApparentTemp) maxTemp = hour.apparentTemp;
    if (hour.temp < minApparentTemp) minTemp = hour.apparentTemp;

    days[days.length - 1].hours.push(hour);
  }
  console.log(minTemp, maxTemp);

  const outcome: WeatherData = {
    days: days,
    maxTemp: maxTemp,
    minTemp: minTemp,
  };

  return outcome;
};
