<script setup lang="ts">
import { computed, ref } from "vue";
import {
  RawWeatherData,
  WeatherHour,
  WeatherData,
  WeatherDay,
  Options,
} from "../interfaces/Types";
import HourSlot from "./HourSlot.vue";
import DaySlot from "./DaySlot.vue";
import { crunchWeatherData } from "../helpers/data-crunch";

const options = ref<Options>({
  useFeelLikeTemp: true,
  hidePast: true,
});

const lat = ref(0);
const long = ref(0);

const rawWeatherData = ref<RawWeatherData | null>(null);

const weatherData = computed<WeatherData | undefined>(() => {
  if (rawWeatherData.value) {
    return crunchWeatherData(rawWeatherData.value);
  }
});
const pastDays = computed<WeatherDay[] | undefined>(() => {
  if (weatherData.value) {
    return weatherData.value.days.filter((day) => day.tense === "past");
  }
});
const nowFutureDays = computed<WeatherDay[] | undefined>(() => {
  if (weatherData.value) {
    return weatherData.value.days.filter(
      (day) => day.tense === "future" || day.tense === "now"
    );
  }
});

const fetchWeatherData = () => {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const cachedWeatherData = localStorage.getItem("weather-data");
  const cachedWeatherDataTime = localStorage.getItem("weather-data-time");
  let update = true;

  if (cachedWeatherData && cachedWeatherDataTime) {
    update =
      Date.now() - new Date(Number.parseInt(cachedWeatherDataTime)).getTime() >
      new Date(0).setUTCHours(1);
  }

  if (update) {
    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat.value}&longitude=${long.value}&hourly=temperature_2m,relativehumidity_2m,dewpoint_2m,apparent_temperature,pressure_msl,precipitation,weathercode,snow_height,freezinglevel_height,cloudcover,cloudcover_low,cloudcover_mid,cloudcover_high,shortwave_radiation,direct_radiation,diffuse_radiation,evapotranspiration,vapor_pressure_deficit,windspeed_10m,windspeed_80m,windspeed_120m,windspeed_180m,winddirection_10m,winddirection_80m,winddirection_120m,winddirection_180m,windgusts_10m,soil_temperature_0cm,soil_temperature_6cm,soil_temperature_18cm,soil_temperature_54cm,soil_moisture_0_1cm,soil_moisture_1_3cm,soil_moisture_3_9cm,soil_moisture_9_27cm,soil_moisture_27_81cm&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,precipitation_sum,precipitation_hours,windspeed_10m_max,windgusts_10m_max,winddirection_10m_dominant,shortwave_radiation_sum&timezone=${timeZone}&past_days=2`
    )
      .then((response) => response.json())
      .then((data) => {
        rawWeatherData.value = data;
        localStorage.setItem("weather-data", JSON.stringify(data));
        localStorage.setItem("weather-data-time", Date.now() + "");
      });
  } else if (cachedWeatherData) {
    rawWeatherData.value = JSON.parse(cachedWeatherData);
  }
};

const fetchCachedLocation = () => {
  const storedLat = localStorage.getItem("lat");
  const storedLong = localStorage.getItem("long");
  if (storedLat && storedLong) {
    lat.value = Number.parseFloat(storedLat);
    long.value = Number.parseFloat(storedLong);
    fetchWeatherData();
  }
};

const fetchCurrentLocation = () => {
  navigator.geolocation.getCurrentPosition((position) => {
    let newLat = position.coords.latitude;
    let newLong = position.coords.longitude;
    // let newLat = 37.7577627;
    // let newLong = -122.4726194;

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
};

fetchCachedLocation();
fetchCurrentLocation();
</script>

<template>
  <!-- <p>{{ lat }}</p>
  <p>{{ long }}</p> -->
  <label>
    <p>feel like tempreature</p>
    <input type="checkbox" v-model="options.useFeelLikeTemp" />
  </label>
  <section class="all-weather" v-if="weatherData">
    <details>
      <summary>past</summary>
      <article>
        <DaySlot
          v-for="day in pastDays"
          :day="day"
          :weather-data="weatherData"
          :options="options"
        />
      </article>
    </details>
    <article>
      <DaySlot
        v-for="day in nowFutureDays"
        :day="day"
        :weather-data="weatherData"
        :options="options"
      />
    </article>
  </section>
  <p>
    <a href="https://open-meteo.com/" target="_blank">Weather data by Open-Meteo.com</a>
  </p>
</template>

<style lang="scss" scoped>
.all-weather {
  width: 100%;
  padding: 0 20px;
  max-width: 500px;
  margin: 0 auto;
}
</style>
