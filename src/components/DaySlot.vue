<script setup lang="ts">
import {
  Options,
  WeatherData,
  WeatherDay,
  WeatherHour,
} from "../interfaces/Types";
import HourSlot from "./HourSlot.vue";

const props = defineProps<{
  day: WeatherDay;
  weatherData: WeatherData;
  options: Options;
}>();

const dayOptions: Intl.DateTimeFormatOptions = {
  weekday: "short",
  month: "short",
  day: "numeric",
};
</script>

<template>
  <div>
    <h2 class="day-title">
      {{ day.date.toLocaleString("en-us", dayOptions) }}
    </h2>
    <HourSlot
      v-for="hour in day.hours"
      :hour="hour"
      :weather-data="weatherData"
      :options="options"
      :day="day"
    />
  </div>
</template>

<style scoped>
.day-title {
  position: sticky;
  top: 0;
  left: 0;
  z-index: 1;
  background-color: #fff1;
  margin: 0;
  padding: 0.5rem;
  backdrop-filter: blur(20px);
}
</style>
