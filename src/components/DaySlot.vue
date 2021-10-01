<script setup lang="ts">
import { WeatherHour } from "../interfaces/WeatherData";
import HourSlot from "./HourSlot.vue";

defineProps<{
  day: WeatherHour[];
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
      {{ day[0].time.toLocaleString("en-us", dayOptions) }}
    </h2>
    <HourSlot v-for="hour in day" :hour="hour" />
  </div>
</template>

<style>
.day-title {
  position: sticky;
  top:0;
  left: 0;
  z-index: 1;
  background-color: #fff9;
  margin: 0;
  padding: .5rem;
  backdrop-filter: blur(20px);
}
</style>