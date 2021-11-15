<script setup lang="ts">
import { WeatherData, WeatherDay, WeatherHour } from "../interfaces/Types";
import { weatherCodeMap } from "../helpers/helpers";
import { onMounted } from "@vue/runtime-core";
import { computed, ref } from "vue";

const props = defineProps<{
  weatherData: WeatherData;
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

const apparentTempPercent = computed(() => {
  const delta =
    props.weatherData.apparentTempRange.max -
    props.weatherData.apparentTempRange.min;
  return (
    ((props.hour.values.apparent_temperature -
      props.weatherData.apparentTempRange.min) /
      delta) *
    100
  );
});
const tempPercent = computed(() => {
  const delta =
    props.weatherData.tempRange.max - props.weatherData.tempRange.min;
  return (
    ((props.hour.values.temperature_2m - props.weatherData.tempRange.min) /
      delta) *
    100
  );
});

const precipitationPrecent = computed(() => {
  return (
    (props.hour.values.precipitation / props.weatherData.maxPrecipitation) * 100
  );
});

const timeOptions: Intl.DateTimeFormatOptions = {
  hour: "numeric",
};
</script>
<template>
  <div class="hour" v-if="hour.tense !== 'past'">
    <p>{{ hour.date.toLocaleString("en-us", timeOptions).toLowerCase() }}</p>
    <div></div>
    <p class="weather">
      {{ weatherCodeMap.get(hour.values.weathercode) }}
    </p>
    <div class="cloud-graph">
      <div class="cloud" :style="{ height: `${hour.values.cloudcover_high}%` }"></div>
    </div>
    <div class="cloud-graph">
      <div class="cloud" :style="{ height: `${hour.values.cloudcover_mid}%` }"></div>
    </div>
    <div class="cloud-graph">
      <div class="cloud" :style="{ height: `${hour.values.cloudcover_low}%` }"></div>
    </div>
    <div class="graph">
      <p class="temperature" :style="{ bottom: `${apparentTempPercent}%` }">
        {{ hour.values.apparent_temperature.toFixed(1) }}
      </p>
      <div
        class="precipitation"
        :style="{ height: `${precipitationPrecent}%` }"
      ></div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
p {
  white-space: nowrap;
}
.hour {
  display: grid;
  grid-template-rows: 1fr auto auto;
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
  color: #ffffffcc;
}
.graph {
  height: 8rem;
  position: relative;
  margin-top: 2rem;
}

.temperature {
  position: absolute;
  left: 0;
}
.precipitation {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 2px;
  background-color: #ffffff50;
}

.cloud-graph {
  height: 2rem;
  display: flex;
  align-items: center;
}
.cloud {
  width: 100%;
  background-color: #ffffff30;
  transform: scale(2,1);

  filter: blur(5px);
}
</style>
