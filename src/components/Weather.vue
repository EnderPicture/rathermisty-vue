<script setup lang="ts">
import { computed, ref } from "vue";
import { RawWeatherData, WeatherHour } from "../interfaces/WeatherData";
import HourSlot from "./HourSlot.vue";
import DaySlot from "./DaySlot.vue";

const useFeelLikeTemp = ref(true);
const hidePast = ref(true);

const lat = ref(0);
const long = ref(0);

const rawWeatherData = ref<RawWeatherData | null>(null);
const weatherData = computed(() => {
  if (rawWeatherData.value) {
    let pastHourly: WeatherHour[] = [];
    let thisHour: WeatherHour | undefined = undefined;
    let hourly: WeatherHour[] = [];
    let days: WeatherHour[][] = [];
    let maxTemp = Number.MIN_VALUE;
    let minTemp = Number.MAX_VALUE;

    let lastWeatherCode = -1;
    let lastDay = -1;

    for (let i = 0; i < rawWeatherData.value.hourly.time.length; i++) {
      let time = new Date(rawWeatherData.value.hourly.time[i] * 1000);
      let weatherCode = rawWeatherData.value.hourly.weathercode[i];

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
        tempUnit: rawWeatherData.value.hourly_units.apparent_temperature,
        feelLikeTemp: rawWeatherData.value.hourly.apparent_temperature[i],
        temp: rawWeatherData.value.hourly.temperature_2m[i],
        weatherCode: weatherCode,

        time: time,
        newDay: newDay,
        newWeather: newWeather,
        tense: tense,
      };

      const temp = useFeelLikeTemp.value ? hour.feelLikeTemp : hour.temp;

      if (temp > maxTemp) maxTemp = temp;
      if (temp < minTemp) minTemp = temp;

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

    return {
      pastHourly: pastHourly,
      thisHour: thisHour,
      hourly: hourly,
      days: days,
      maxTemp: maxTemp,
      minTemp: minTemp,
    };
  }
});
const now = Date.now();

const fetchWeatherData = () => {
  fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat.value}&longitude=${long.value}&past_days=1&current_weather=true&timeformat=unixtime&hourly=temperature_2m,relativehumidity_2m,dewpoint_2m,apparent_temperature,weathercode,cloudcover,windspeed_10m`
  )
    .then((response) => response.json())
    .then((data) => {
      rawWeatherData.value = data;
    });
};

const storedLat = localStorage.getItem("lat");
const storedLong = localStorage.getItem("long");
if (storedLat && storedLong) {
  lat.value = Number.parseFloat(storedLat);
  long.value = Number.parseFloat(storedLong);
  fetchWeatherData();
}

navigator.geolocation.getCurrentPosition((position) => {
  let newLat = position.coords.latitude;
  let newLong = position.coords.longitude;

  if (
    Math.floor(lat.value * 1000) !== Math.floor(newLat * 1000) ||
    Math.floor(long.value * 1000) !== Math.floor(newLong * 1000)
  ) {
    lat.value = newLat;
    long.value = newLong;

    localStorage.setItem("lat", lat.value.toString());
    localStorage.setItem("long", long.value.toString());

    fetchWeatherData();
  }
});
</script>

<template>
  <p>{{ lat }}</p>
  <p>{{ long }}</p>
  <label>
    <p>show past</p>
    <input type="checkbox" v-model="hidePast" />
  </label>
  <div v-if="weatherData">
    <div v-show="!hidePast">
      <!-- <div>
        <HourSlot v-for="hour in weatherData.pastHourly" :hour="hour" />
      </div> -->
      <div>
        <HourSlot v-if="weatherData.thisHour" :hour="weatherData.thisHour" />
        <HourSlot v-for="hour in weatherData.hourly" :hour="hour" />
      </div>
    </div>
    <div v-show="hidePast">
      <DaySlot v-for="day in weatherData.days" :day="day" />
    </div>
  </div>
  <p>
    <a href="https://open-meteo.com/">Weather data by Open-Meteo.com</a>
  </p>
</template>

<style scoped></style>
