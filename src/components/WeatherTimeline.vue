<script setup lang="ts">
import { WeatherData, WeatherDay } from "../interfaces/Types";
import HourView from "./HourView.vue";

defineProps<{
  weatherData: WeatherData;
  days: WeatherDay[];
}>();

const dayOptions: Intl.DateTimeFormatOptions = {
  weekday: "short",
  month: "short",
  day: "numeric",
};
</script>
<template>
  <section class="timeline">
    <div class="scroll">
      <div class="track">
        <article class="day" v-for="day in days">
          <div class="day-marker">
            {{ day.date.toLocaleString("en-us", dayOptions) }}
          </div>
          <HourView
            v-for="(hour, index) in day.hours"
            :day="day"
            :hour="hour"
            :new-day="index === 0"
            :weather-data="weatherData"
          />
        </article>
      </div>
    </div>
  </section>
</template>
<style lang="scss" scoped>
.timeline {
  margin-top: 50px;
  width: 100%;
}
.scroll {
  overflow-x: scroll;
  scrollbar-width: none;
  transform: translateZ(0);
  &::-webkit-scrollbar {
    display: none;
  }
}
.track {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: min-content;
  padding: 1rem 5rem;
  width: max-content;
}
.day {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: min-content;
}
.day-marker {
  position: sticky;
  left: 0;
  writing-mode: vertical-rl;
  text-orientation: mixed;
  z-index: 10;
  font-weight: 800;
}
</style>
