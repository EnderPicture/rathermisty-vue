<script setup lang="ts">
import { WeatherHour } from "../interfaces/Types";
import HourSlot from "./HourSlot.vue";

const props = defineProps<{
  day: WeatherHour[];
  minTemp: number;
  maxTemp: number;
  useFeelslike: boolean;
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
    <HourSlot
      v-for="hour in day"
      :hour="hour"
      :min-temp="minTemp"
      :max-temp="maxTemp"
      :use-feelslike="useFeelslike"
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
