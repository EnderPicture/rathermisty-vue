<script setup lang="ts">
import { WeatherHour } from "../interfaces/WeatherData";

defineProps<{
  hour: WeatherHour;
}>();

const weatherCodeMap = new Map<number, string>([
  [0, "Clear Sky"],
  [1, "Mainly Clear"],
  [2, "Partly Cloudy"],
  [3, "Overcast"],
  [45, "Fog"],
  [48, "Depositing Rime Fog"],
  [51, "Light Drizzle"],
  [53, "Moderate Drizzle "],
  [55, "Dense Drizzle"],
  [56, "Light Freezing Drizzle"],
  [57, "Dense Freezing Drizzle"],
  [61, "Slight Rain"],
  [63, "Moderate Rain"],
  [65, "Heavy Rain"],
  [66, "Light Freezing Rain"],
  [67, "Heavy Freezing Rain"],
  [71, "Slight Snow Fall"],
  [73, "Moderate Snow Fall"],
  [75, "Heavy Snow Fall"],
  [77, "Snow Grains"],
  [80, "Slight Rain Showers"],
  [81, "Moderate Rain Showers"],
  [82, "Violent Rain Showers"],
  [85, "Slight Snow Showers"],
  [86, "Heavy Snow Showers"],
  [95, "Thunderstorm"],
  [96, "Thunderstorm With Slight Hail"],
  [99, "Thunderstorm With Heavy Hail"],
]);

const timeOptions: Intl.DateTimeFormatOptions = {
  hour: "numeric",
};

</script>

<template>
  <div :class="{ hour: true, past: hour.tense === 'past', now: hour.tense === 'now' }">
    <p>
      {{ hour.time.toLocaleString("en-us", timeOptions) }}
    </p>
    <p>
      {{ weatherCodeMap.get(hour.weatherCode) }}
    </p>
    <p>feels like {{ hour.feelLikeTemp }} {{ hour.tempUnit }} actual {{hour.temp}} {{ hour.tempUnit }}</p>
  </div>
</template>

<style>
.hour {
  background-color: antiquewhite;
  text-align: center;
  display: grid;
  grid-template-columns: 1fr 5fr 5fr;
}

.past {
  opacity: 0.5;
}
.now {
  background-color: azure;
}
</style>
