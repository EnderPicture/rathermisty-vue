<script setup lang="ts">
import { WeatherDay, WeatherHour } from "../interfaces/Types";
import { weatherCodeMap } from "../helpers/helpers";
import { onMounted } from "@vue/runtime-core";
import { ref } from "vue";

const props = defineProps<{
  newDay: boolean;
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
  <div class="hour" v-if="hour.tense !== 'past'">
    <p class="time" ref="time">
      {{ hour.date.toLocaleString("en-us", timeOptions).toLowerCase() }}
    </p>
    <div class="spacer"></div>
    
    <p class="weather">
      {{ weatherCodeMap.get(hour.values.weathercode) }}
    </p>
  </div>
</template>
<style lang="scss" scoped>
p {
  white-space: nowrap;
}
.hour {
  display: flex;
  flex-direction: column;

  // will-change: opacity;
  transition: opacity .5s ease;
  &:hover {
    transition: opacity .1s ease;
    opacity: .5;
  }

  *+* {
    margin-top: 1rem;
  }
}
.time {
  text-align: end;
}
.spacer {
  flex: 1;
}
p {
  writing-mode: vertical-rl;
  text-orientation: mixed;
  margin: 0;
  // opacity: .8;
  color: #ffffffcc;
}
.weather {
  // flex: 1;
}
.sticky {
  position: sticky;
  transform: translateZ(0);
  left: 0;
}
</style>
