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
  margin-right: auto;
  margin-left: auto;
}
.scroll {
  overflow-x: scroll;
  scrollbar-width: none;
  transform: translateZ(0);
  &::-webkit-scrollbar {
    display: none;
  }
  .track {
    display: flex;
    padding: 1rem 5rem;
    align-items: stretch;
    width: max-content;
  }
  .day {
    display: flex;
  }
  .day-marker {
    position: sticky;
    transform: translateZ(0);
    left: 0;
    writing-mode: vertical-rl;
    text-orientation: mixed;
    color: #ffffffcc;
    font-weight: 800;
    z-index: 10;
    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
      background-color: white;
      opacity: 0.2;
      filter: blur(5px);
    }
  }
}
</style>
