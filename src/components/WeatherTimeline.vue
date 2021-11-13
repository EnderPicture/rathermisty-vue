<script setup lang="ts">
import { WeatherDay } from "../interfaces/Types";
import HourView from "./HourView.vue";

defineProps<{
  days: WeatherDay[];
}>();
</script>
<template>
  <Section class="scroll">
    <div class="track">
      <template v-for="day in days">
        <HourView v-for="hour in day.hours" :day="day" :hour="hour" />
      </template>
    </div>
  </Section>
</template>
<style lang="scss" scoped>
.scroll {
  overflow-x: scroll;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
  .track {
    display: grid;
    grid-auto-columns: auto;
    grid-auto-flow: column;
    grid-template-rows: auto auto;
    transform: translateZ(0);
    gap: 2rem .1rem;
  }
}
</style>
