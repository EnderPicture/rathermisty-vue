<script setup lang="ts">
import { WeatherHour } from "../interfaces/Types";
import CloudCoverage from "./CloudCoverage.vue";
import WindDisplay from "./WindDisplay.vue";

defineProps<{
  thisHour: WeatherHour;
}>();
</script>
<template>
  <section class="atmosphere">
    <p class="column-name">altitude</p>
    <p class="column-name">wind</p>
    <p class="column-name">cloud cover</p>
    <p class="altitude"></p>
    <div></div>
    <CloudCoverage
      :percent="thisHour.values.cloudcover_high"
      :unit="thisHour.units.cloudcover_high"
    ></CloudCoverage>
    <p class="altitude">8000<sub class="unit">m</sub></p>
    <p class="col-span-2 altitude-line"></p>
    <p class="altitude"></p>
    <div></div>
    <CloudCoverage
      :percent="thisHour.values.cloudcover_mid"
      :unit="thisHour.units.cloudcover_mid"
    ></CloudCoverage>
    <p class="altitude">3000<sub class="unit">m</sub></p>
    <p class="col-span-2 altitude-line"></p>
    <p class="altitude">180<sub class="unit">m</sub></p>
    <WindDisplay
      :wind-speed="thisHour.values.windspeed_180m"
      :wind-speed-unit="thisHour.units.windspeed_180m"
      :wind-direction="thisHour.values.winddirection_180m"
      :wind-direction-unit="thisHour.units.winddirection_180m"
    ></WindDisplay>
    <CloudCoverage
      class="row-span-4"
      :percent="thisHour.values.cloudcover_low"
      :unit="thisHour.units.cloudcover_low"
      :wind-speeds="[
        thisHour.values.windspeed_180m,
        thisHour.values.windspeed_120m,
        thisHour.values.windspeed_80m,
        thisHour.values.windspeed_10m,
      ]"
    ></CloudCoverage>
    <p class="altitude">120<sub class="unit">m</sub></p>
    <WindDisplay
      :wind-speed="thisHour.values.windspeed_120m"
      :wind-speed-unit="thisHour.units.windspeed_120m"
      :wind-direction="thisHour.values.winddirection_120m"
      :wind-direction-unit="thisHour.units.winddirection_120m"
    ></WindDisplay>
    <p class="altitude">80<sub class="unit">m</sub></p>
    <WindDisplay
      :wind-speed="thisHour.values.windspeed_80m"
      :wind-speed-unit="thisHour.units.windspeed_80m"
      :wind-direction="thisHour.values.winddirection_80m"
      :wind-direction-unit="thisHour.units.winddirection_80m"
    ></WindDisplay>
    <p class="altitude">10<sub class="unit">m</sub></p>
    <WindDisplay
      :wind-speed="thisHour.values.windspeed_10m"
      :wind-speed-unit="thisHour.units.windspeed_10m"
      :wind-direction="thisHour.values.winddirection_10m"
      :wind-direction-unit="thisHour.units.winddirection_10m"
    ></WindDisplay>
    <p class="altitude">0<sub class="unit">m</sub></p>
    <p class="col-span-2 altitude-line"></p>
  </section>
</template>

<style lang="scss" scoped>
.atmosphere {
  display: grid;
  grid-template-columns: min-content min-content 1fr;
  grid-auto-rows: auto;
  gap: 0.25rem 1rem;
  margin-top: 50px;

  .unit {
    font-size: 0.6em;
    vertical-align: baseline;
    opacity: 0.5;
  }

  p {
    margin: 0;
  }

  .col-span-2 {
    grid-column-end: span 2;
  }
  .row-span-4 {
    grid-row-end: span 4;
  }

  .column-name {
    text-align: center;
    opacity: 0.5;
    margin-bottom: 1rem;
  }
  .altitude {
    text-align: right;
    opacity: 0.5;
    white-space: nowrap;
    font-size: 1.1rem;
  }
  .altitude-line {
    height: 2px;
    background-color: white;
    align-self: center;
    opacity: 0.3;
  }
}
</style>
