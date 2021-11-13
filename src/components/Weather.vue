<script setup lang="ts">
import { computed, ref } from "vue";
import {
  RawWeatherData,
  WeatherHour,
  WeatherData,
  WeatherDay,
  Options,
} from "../interfaces/Types";
import { crunchWeatherData } from "../helpers/data-crunch";

import { weatherCodeMap } from "../helpers/helpers";
import CloudCoverage from "./CloudCoverage.vue";
import WindDisplay from "./WindDisplay.vue";
import AltitudeDisplay from "./AltitudeDisplay.vue";
import WeatherTimeline from "./WeatherTimeline.vue";

const lat = ref(0);
const long = ref(0);

const rawWeatherData = ref<RawWeatherData | null>(null);

const weatherData = computed<WeatherData | undefined>(() => {
  if (rawWeatherData.value) {
    return crunchWeatherData(rawWeatherData.value);
  }
});
const today = computed<WeatherDay | undefined>(() => {
  return weatherData.value?.days.find((day) => day.tense === "now");
});
const thisHour = computed<WeatherHour | undefined>(() => {
  return today.value?.hours.find((hour) => hour.tense === "now");
});

const fetchWeatherData = (force = false) => {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const cachedWeatherData = localStorage.getItem("weather-data");
  const cachedWeatherDataTime = localStorage.getItem("weather-data-time");
  let update = true;

  if (cachedWeatherData && cachedWeatherDataTime) {
    rawWeatherData.value = JSON.parse(cachedWeatherData);

    const updateTime = new Date(Number.parseInt(cachedWeatherDataTime));
    const timeSinceUpdate = Date.now() - updateTime.getTime();
    const updateInterval = new Date(0).setUTCHours(1);
    update = timeSinceUpdate > updateInterval;
  }

  // fetch(`https://photon.komoot.io/reverse?lon=${long.value}&lat=${lat.value}`)
  //   .then((response) => response.json())
  //   .then((data) => {
  //     console.log(data.features[0].properties);
  //   });
  if (update || force) {
    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat.value}&longitude=${long.value}&hourly=temperature_2m,relativehumidity_2m,dewpoint_2m,apparent_temperature,pressure_msl,precipitation,weathercode,snow_height,freezinglevel_height,cloudcover,cloudcover_low,cloudcover_mid,cloudcover_high,shortwave_radiation,direct_radiation,diffuse_radiation,evapotranspiration,vapor_pressure_deficit,windspeed_10m,windspeed_80m,windspeed_120m,windspeed_180m,winddirection_10m,winddirection_80m,winddirection_120m,winddirection_180m,windgusts_10m,soil_temperature_0cm,soil_temperature_6cm,soil_temperature_18cm,soil_temperature_54cm,soil_moisture_0_1cm,soil_moisture_1_3cm,soil_moisture_3_9cm,soil_moisture_9_27cm,soil_moisture_27_81cm&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,precipitation_sum,precipitation_hours,windspeed_10m_max,windgusts_10m_max,winddirection_10m_dominant,shortwave_radiation_sum&timezone=${timeZone}&past_days=2`
    )
      .then((response) => response.json())
      .then((data) => {
        rawWeatherData.value = data;
        localStorage.setItem("weather-data", JSON.stringify(data));
        localStorage.setItem("weather-data-time", Date.now() + "");
      });
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
    // let newLat = 52.52;
    // let newLong = 13.41;

    const shouldUpdate =
      Math.floor(lat.value * 1000) !== Math.floor(newLat * 1000) ||
      Math.floor(long.value * 1000) !== Math.floor(newLong * 1000);

    if (shouldUpdate) {
      lat.value = newLat;
      long.value = newLong;

      // save new copy
      localStorage.setItem("lat", lat.value.toString());
      localStorage.setItem("long", long.value.toString());

      fetchWeatherData(true);
    }
  });
};

fetchCachedLocation();
fetchCurrentLocation();
</script>

<template>
  <div class="background"></div>
  <main class="weather-container" v-if="weatherData && thisHour">
    <section class="width">
      <p class="intro-text">
        Currently, it's actually {{ thisHour.values.temperature_2m
        }}{{ thisHour.units.temperature_2m }}
      </p>
      <p class="intro-text">but feels like</p>
      <p class="temp">
        {{ thisHour.values.apparent_temperature
        }}<sub class="unit">{{ thisHour.units.apparent_temperature }}</sub>
      </p>
      <p class="weather">
        {{ weatherCodeMap.get(thisHour.values.weathercode) }}
      </p>
    </section>
    <AltitudeDisplay class="width" :this-hour="thisHour" />
    <WeatherTimeline :days="weatherData?.days" />
  </main>
  <footer>
    <p class="bottom-text">Made by Donny Wu</p>
    <p class="bottom-text">
      more data on
      <router-link to="/old">old page</router-link>. this page will be updated
      with all data soon
    </p>
    <p class="bottom-text">
      Weather data by
      <a href="https://open-meteo.com/" target="_blank"> Open-Meteo.com </a>
    </p>
  </footer>
</template>

<style lang="scss" scoped>
.width {
  margin: 0 auto;
  max-width: 25rem;
  padding: 1rem;
}
.background {
  position: fixed;
  width: 100vw;
  height: 110vh;
  top: 0;
  left: 0;
  z-index: -100;
  background: linear-gradient(180deg, #5f8ace 0%, #3069c2 100%);
}
.weather-container {
  color: white;
}
.bottom-text {
  padding: 0 1rem;
  margin-right: auto;
  margin-left: auto;
  max-width: 25rem;
  text-align: center;
  color: white;
  opacity: 0.8;

  a {
    color: inherit;
    transition: opacity 0.5s ease;
    will-change: opacity;
    &:hover {
      transition: opacity 0.1s ease;
      opacity: 0.5;
    }
    &:active {
      transition: opacity 0.1s ease;
      opacity: 0.4;
    }
  }
}

.intro-text {
  opacity: 0.8;
  margin-bottom: -0.5rem;
}

.unit {
  font-size: 0.6em;
  vertical-align: baseline;
  opacity: 0.5;
}

.temp {
  font-size: 6rem;
  color: white;
  opacity: 0.9;
  font-weight: 900;
  margin: 0;
}
.weather {
  font-size: 2rem;
  color: white;
  opacity: 0.8;
  font-weight: 400;
  margin: 0;
}
</style>
