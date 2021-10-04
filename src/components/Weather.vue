<script setup lang="ts">
import { computed, ref } from "vue";
import { RawWeatherData, WeatherHour, WeatherData } from "../interfaces/Types";
import HourSlot from "./HourSlot.vue";
import DaySlot from "./DaySlot.vue";
import { crunchWeatherData } from "../helpers/weather-data-crunch";

const useFeelLikeTemp = ref(true);
const hidePast = ref(true);

const lat = ref(0);
const long = ref(0);

const rawWeatherData = ref<RawWeatherData | null>(null);
const weatherData = computed<WeatherData | undefined>(() => {
    if (rawWeatherData.value) {
      return crunchWeatherData(rawWeatherData.value);
    }
});
const now = Date.now();

const fetchWeatherData = () => {
  fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat.value}&longitude=${long.value}&past_days=1&current_weather=true&timeformat=unixtime&hourly=temperature_2m,relativehumidity_2m,dewpoint_2m,apparent_temperature,weathercode,cloudcover,precipitation,windspeed_10m`
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
  // let newLat = position.coords.latitude;
  // let newLong = position.coords.longitude;
  let newLat = 37.7577627;
  let newLong = -122.4726194;

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
  <!-- <p>{{ lat }}</p>
  <p>{{ long }}</p> -->
  <label>
    <p>feel like tempreature</p>
    <input type="checkbox" v-model="useFeelLikeTemp" />
  </label>
  <div class="all-weather" v-if="weatherData">
    <div>
      <DaySlot
        v-for="day in weatherData.days"
        :day="day"
        :min-temp="weatherData.minTemp"
        :max-temp="weatherData.maxTemp"
        :use-feelslike="useFeelLikeTemp"
      />
    </div>
  </div>
  <p>
    <a href="https://open-meteo.com/">Weather data by Open-Meteo.com</a>
  </p>
</template>

<style scoped>
.all-weather {
  max-width: 30rem;
  margin: 0 auto;
}
</style>
