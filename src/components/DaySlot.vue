<script setup lang="ts">
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
  <details :open="hourDetailsOpen" @click.prevent>
    <summary @click="hourDetailsOpen = !hourDetailsOpen">
      {{ day.date.toLocaleString("en-us", dayOptions) }}
    </summary>
    <div v-if="hourDetailsOpen">
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
  </details>
</template>

<style lang="scss" scoped>
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
// details > summary::-webkit-details-marker {
//   display: none;
// }
details {
  > summary {
    list-style: none;
  }
}
</style>
