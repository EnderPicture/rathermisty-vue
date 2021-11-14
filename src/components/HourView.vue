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
    <p class="time" ref="time">
      {{ hour.date.toLocaleString("en-us", timeOptions).toLowerCase() }}
    </p>
    <div class="spacer"></div>
    <p class="weather">
      {{ weatherCodeMap.get(hour.values.weathercode) }}
    </p>

    <div class="graph cloud">
      <div
        class="graph-bar cloud"
        :style="{ transform: `scaleY(${hour.values.cloudcover_high}%)` }"
      >
        <div></div>
      </div>
    </div>
    <div class="graph cloud">
      <div
        class="graph-bar cloud"
        :style="{ transform: `scaleY(${hour.values.cloudcover_mid}%)` }"
      >
        <div></div>
      </div>
    </div>
    <div class="graph cloud">
      <div
        class="graph-bar cloud"
        :style="{ transform: `scaleY(${hour.values.cloudcover_low}%)` }"
      >
        <div></div>
      </div>
    </div>

    <div class="graph">
      <div
        class="graph-bar temperature"
        :style="{ transform: `translateY(-${apparentTempPercent}%)` }"
      >
        <p class="temperature">
          {{ hour.values.apparent_temperature.toFixed(1) }}
        </p>
      </div>
      <div
        class="graph-bar wind"
        :style="{ transform: `translateY(-${hour.values.windspeed_10m}%)` }"
      >
        <img
          src="/direction.svg"
          alt=""
          :style="{ transform: `rotate(${hour.values.winddirection_10m}deg)` }"
        />
      </div>
      <div
        class="graph-bar precipitation"
        :style="{ transform: `scaleY(${precipitationPrecent}%)` }"
      >
        <div></div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
p {
  white-space: nowrap;
}
.hour {
  display: flex;
  flex-direction: column;

  // contain: strict;
  // width: 1rem;
  // height: 50rem;

  // will-change: opacity;
  // transition: opacity 0.5s ease;
  // &:hover {
  //   transition: opacity 0.1s ease;
  //   opacity: 0.5;
  // }

  > * + * {
    margin-top: 0.5rem;
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
.sticky {
  position: sticky;
  transform: translateZ(0);
  left: 0;
}
.graph {
  height: 9rem;
  position: relative;
  margin-bottom: 1rem;

  &.cloud {
    margin-bottom: 0;
    height: 1rem;
    filter: blur(5px);
    width: 100%;
    transform: scaleX(200%);
  }

  .graph-bar {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    // pointer-events: none;
    z-index: 1;

    > :first-child {
      width: 100%;
      position: absolute;
      bottom: 0;
      left: 0;
    }
    &.temperature {
      > :first-child {
        color: #ffffffcc;
      }
    }
    &.wind {
      > :first-child {
        opacity: 0.5;
        display: flex;
        width: 100%;
        height: 0.8rem;
      }
    }
    &.precipitation {
      transform-origin: bottom center;
      width: 2px;
      > :first-child {
        height: 100%;
        opacity: 0.3;
        background-color: white;
      }
    }
    &.cloud {
      transform-origin: center center;
      // width: 2px;
      > :first-child {
        height: 100%;
        opacity: 0.3;
        background-color: white;
      }
    }
  }
}
</style>
