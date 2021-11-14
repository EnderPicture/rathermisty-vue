<script setup lang="ts">
import { WeatherDay } from "../interfaces/Types";
import HourView from "./HourView.vue";

defineProps<{
  days: WeatherDay[];
}>();

const dayOptions: Intl.DateTimeFormatOptions = {
  weekday: "short",
  month: "short",
  day: "numeric",
};
</script>
<template>
  <Section class="timeline">
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
          />
        </article>
      </div>
    </div>
  </Section>
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
  &::-webkit-scrollbar {
    display: none;
  }
  .track {
    transform: translateZ(0);
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
  }
}
</style>
