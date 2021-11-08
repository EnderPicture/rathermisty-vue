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

const lat = ref(0);
const long = ref(0);

const rawWeatherData = ref<RawWeatherData | null>(null);

const weatherData = computed<WeatherData | undefined>(() => {
  if (rawWeatherData.value) {
    return crunchWeatherData(rawWeatherData.value);
  }
});
const pastDays = computed<WeatherDay[] | undefined>(() => {
  return weatherData.value?.days.filter((day) => day.tense === "past");
});
const futureDays = computed<WeatherDay[] | undefined>(() => {
  return weatherData.value?.days.filter((day) => day.tense === "future");
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
    const updateTime = new Date(Number.parseInt(cachedWeatherDataTime));
    const timeSinceUpdate = Date.now() - updateTime.getTime();
    const updateInterval = new Date(0).setUTCHours(1);
    update = timeSinceUpdate > updateInterval;
  }

  fetch(`https://photon.komoot.io/reverse?lon=${long.value}&lat=${lat.value}`)
    .then((response) => response.json())
    .then((data) => {
      console.log(data.features[0].properties);
    });
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
    // let newLat = 34.0514791;
    // let newLong = -118.4095937;

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
  <main class="weather-container" v-if="thisHour">
    <section>
      <p>currently, it's</p>
      <p class="temp">
        {{ thisHour.values.apparent_temperature
        }}<sub class="unit">{{ thisHour.units.apparent_temperature }}</sub>
      </p>
      <p class="weather">
        {{ weatherCodeMap.get(thisHour.values.weathercode) }}
      </p>
    </section>
    <section class="atmosphere">
      <p class="column-name">altitude</p>
      <p class="column-name">wind</p>
      <p class="column-name">cloud cover</p>
      <p class="altitude"></p>
      <div></div>
      <CloudCoverage
        :percent="thisHour.values.cloudcover_high"
        :unit="thisHour.units.cloudcover_high"
      ></CloudCoverage>
      <p class="altitude">8000<sub class="unit">m</sub></p>
      <p class="col-span-2 altitude-line"></p>
      <p class="altitude"></p>
      <div></div>
      <CloudCoverage
        :percent="thisHour.values.cloudcover_mid"
        :unit="thisHour.units.cloudcover_mid"
      ></CloudCoverage>
      <p class="altitude">3000<sub class="unit">m</sub></p>
      <p class="col-span-2 altitude-line"></p>
      <p class="altitude">180<sub class="unit">m</sub></p>
      <div>
        <p class="wind-speed">
          {{ thisHour.values.windspeed_180m
          }}<sub class="unit">{{ thisHour.units.windspeed_180m }}</sub>
        </p>
      </div>
      <CloudCoverage
        class="row-span-4"
        :percent="thisHour.values.cloudcover_low"
        :unit="thisHour.units.cloudcover_low"
      ></CloudCoverage>
      <p class="altitude">120<sub class="unit">m</sub></p>
      <div>
        <p class="wind-speed">
          {{ thisHour.values.windspeed_120m
          }}<sub class="unit">{{ thisHour.units.windspeed_120m }}</sub>
        </p>
      </div>
      <p class="altitude">80<sub class="unit">m</sub></p>
      <div>
        <p class="wind-speed">
          {{ thisHour.values.windspeed_80m
          }}<sub class="unit">{{ thisHour.units.windspeed_80m }}</sub>
        </p>
      </div>
      <p class="altitude">10<sub class="unit">m</sub></p>
      <div>
        <p class="wind-speed">
          {{ thisHour.values.windspeed_10m
          }}<sub class="unit">{{ thisHour.units.windspeed_10m }}</sub>
        </p>
      </div>
      <p class="altitude">0<sub class="unit">m</sub></p>
      <p class="col-span-2 altitude-line"></p>
    </section>
  </main>
  <p class="attribution">
    Weather data by
    <a href="https://open-meteo.com/" target="_blank"> Open-Meteo.com </a>
  </p>
</template>

<style lang="scss" scoped>
.background {
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  z-index: -100;
  background: linear-gradient(180deg, #5f8ace 0%, #3069c2 100%);
}
.weather-container {
  margin: 0 auto;
  max-width: 25rem;
  padding: 1rem;
  color: white;
}
.attribution {
  text-align: center;
  color: white;
  opacity: 0.8;

  a {
    color: inherit;
    transition: opacity 0.5s ease;
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
  font-size: 3rem;
  color: white;
  opacity: 0.8;
  font-weight: 400;
  margin: 0;
}
.atmosphere {
  display: grid;
  grid-template-columns: min-content min-content 1fr;
  grid-auto-rows: auto;
  gap: 0.5rem 1rem;
  margin-top: 50px;

  p {
    margin: 0;
  }

  .col-span-2 {
    grid-column-end: span 2;
  }
  .row-span-4 {
    grid-row-end: span 4;
  }

  .column-name {
    text-align: center;
    opacity: 0.5;
    margin-bottom: 1rem;
  }
  .altitude {
    text-align: right;
    opacity: 0.5;
    white-space: nowrap;
    font-size: 1.1rem;
  }
  .altitude-line {
    height: 2px;
    background-color: white;
    align-self: center;
    opacity: 0.3;
  }

  .wind-speed {
    opacity: 0.9;
    font-weight: 800;
    font-size: 1.5rem;
  }
}
</style>
