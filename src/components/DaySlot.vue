<script setup lang="ts">
import Accordion from "./Accordion.vue";
import { ref } from "vue";
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

const hourDetailsOpen = ref(props.day.tense === "now");
</script>

<template>
  <div class="daily-con">
    <div class="day-stick">
      <h2>
        {{ day.date.toLocaleString("en-us", dayOptions) }}
      </h2>
    </div>
    <div class="day-title" @click="hourDetailsOpen = !hourDetailsOpen">
      <p class="precipitation_hours">
        precipitation hours: {{ day.values.precipitation_hours }}
      </p>
    </div>
    <Accordion
      :open="hourDetailsOpen"
      @toggle-accordion="hourDetailsOpen = !hourDetailsOpen"
    >
      <template v-slot:summary>
        <p class="hourly_dropdown">open hourly</p>
      </template>
      <template v-slot:details>
        <HourSlot
          v-for="hour in day.hours"
          :hour="hour"
          :weather-data="weatherData"
          :options="options"
          :day="day"
        />
      </template>
    </Accordion>
  </div>
</template>

<style lang="scss" scoped>
.daily-con {
  clip-path: inset(0% 0% 0% 0% round 20px);
  background-color: beige;
  margin-bottom: 1rem;
}
.day-stick {
  position: sticky;
  top: 0;
  z-index: 1;
  display: flex;
  background-color: #222e;
  padding: 0.5rem 1rem;
  h2 {
    margin: 0;
    color: #ddd;
  }
}
.day-title {
  background-color: #f001;
}
.precipitation_hours {
  margin: 0;
  padding: 0.5rem 1rem;
}
.hourly_dropdown {
  margin: 0;
  padding: 0.5rem 1rem;
}
</style>
