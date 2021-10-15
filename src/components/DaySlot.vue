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
<div class="padding">
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
          v-for="(hour, index) in day.hours"
          :hour="hour"
          :weather-data="weatherData"
          :options="options"
          :day="day"
          :index="index"
          :key="+hour.date"
        />
      </template>
    </Accordion>
  </div>
</div>
</template>

<style lang="scss" scoped>
.padding {
  padding-bottom: 1rem;;
}
.daily-con {
  clip-path: inset(0% 0% 0% 0% round 20px);
  background-color: beige;
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
