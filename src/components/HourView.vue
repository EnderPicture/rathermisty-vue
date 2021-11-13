<script setup lang="ts">
import { WeatherDay, WeatherHour } from "../interfaces/Types";
import { weatherCodeMap } from "../helpers/helpers";
import { onMounted } from "@vue/runtime-core";
import { ref } from "vue";

const props = defineProps<{
  day: WeatherDay;
  hour: WeatherHour;
}>();

const time = ref<HTMLElement | null>(null);

// onMounted(() => {
//   if (time.value !== null && props.hour.tense === "now") {
//     time.value.scrollIntoView({ block: "center", behavior: "smooth" });
//   }
// });

const timeOptions: Intl.DateTimeFormatOptions = {
  hour: "numeric",
};
</script>
<template>
  <template v-if="hour.tense !== 'past'">
    <p>
      {{ weatherCodeMap.get(hour.values.weathercode) }}
    </p>
    <p class="time" ref="time">
      {{ hour.date.toLocaleString("en-us", timeOptions).toLowerCase() }}
    </p>
  </template>
</template>
<style lang="scss" scoped>
.time {
  flex: 1;
  text-align: end;
}
p {
  writing-mode: vertical-rl;
  text-orientation: mixed;
  margin: 0;
}
</style>
