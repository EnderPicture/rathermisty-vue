<script setup lang="ts">
import { ref } from "vue";
import { WeatherData } from "../interfaces/WeatherData";

const lat = ref(0);
const long = ref(0);

const weatherData = ref<WeatherData | null>(null);

const storage = window.localStorage;

const weatherCodeMap = new Map<number, string>([
  [0, "Clear sky"],
  [1, "Mainly clear"],
  [2, "partly cloudy"],
  [3, "overcast"],
  [45, "Fog"],
  [48, "depositing rime fog"],
  [51, "Light drizzle"],
  [53, "moderate Drizzle "],
  [55, "dense Drizzle"],
  [56, "Light Freezing Drizzle"],
  [57, "dense Freezing Drizzle"],
  [61, "Slight Rain"],
  [63, "moderate Rain"],
  [65, "heavy Rain"],
  [66, "Light Freezing Rain"],
  [67, "heavy Freezing Rain"],
  [71, "Slight Snow fall"],
  [73, "moderate Snow fall"],
  [75, "heavy Snow fall"],
  [77, "Snow grains"],
  [80, "Slight Rain showers"],
  [81, "moderate Rain showers"],
  [82, "violent Rain showers"],
  [85, "slight Snow showers"],
  [86, "heavy Snow showers"],
  [95, "Thunderstorm"],
  [96, "Thunderstorm with slight hail"],
  [99, "Thunderstorm with heavy hail"],
]);

navigator.geolocation.getCurrentPosition((position) => {
  lat.value = position.coords.latitude;
  long.value = position.coords.longitude;

  fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat.value}&longitude=${long.value}&hourly=temperature_2m,apparent_temperature,weathercode`
  )
    .then((response) => response.json())
    .then((data) => {
      weatherData.value = data;
    });

  const count = ref(0);
});
</script>

<template>
  <p>{{ lat }}</p>
  <p>{{ long }}</p>
  <div class="column">
    <div>
      <p v-for="time in weatherData?.hourly.time">
        {{ time }}
      </p>
    </div>
    <div>
      <p v-for="code in weatherData?.hourly.weathercode">
        {{ weatherCodeMap.get(code) }}
      </p>
    </div>
    <div>
      <p v-for="temp in weatherData?.hourly.temperature_2m">
        {{ temp }}
      </p>
    </div>
    <div>
      <p v-for="temp in weatherData?.hourly.apparent_temperature">
        feels like: {{ temp }}
        {{ weatherData?.hourly_units.apparent_temperature }}
      </p>
    </div>
  </div>
  <p>{{ weatherData?.hourly.temperature_2m }}</p>
</template>

<style scoped>
.column {
  text-align: left;
  display: flex;
  justify-content: center;
}
</style>
