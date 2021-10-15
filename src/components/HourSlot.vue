<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import {
  Options,
  WeatherData,
  WeatherDay,
  WeatherHour,
} from "../interfaces/Types";

const props = defineProps<{
  hour: WeatherHour;
  day: WeatherDay;
  weatherData: WeatherData;
  options: Options;
  index: number;
}>();

const weatherCodeMap = new Map<number, string>([
  [0, "Clear Sky"],
  [1, "Mainly Clear"],
  [2, "Partly Cloudy"],
  [3, "Overcast"],
  [45, "Fog"],
  [48, "Depositing Rime Fog"],
  [51, "Light Drizzle"],
  [53, "Moderate Drizzle "],
  [55, "Dense Drizzle"],
  [56, "Light Freezing Drizzle"],
  [57, "Dense Freezing Drizzle"],
  [61, "Slight Rain"],
  [63, "Moderate Rain"],
  [65, "Heavy Rain"],
  [66, "Light Freezing Rain"],
  [67, "Heavy Freezing Rain"],
  [71, "Slight Snow Fall"],
  [73, "Moderate Snow Fall"],
  [75, "Heavy Snow Fall"],
  [77, "Snow Grains"],
  [80, "Slight Rain Showers"],
  [81, "Moderate Rain Showers"],
  [82, "Violent Rain Showers"],
  [85, "Slight Snow Showers"],
  [86, "Heavy Snow Showers"],
  [95, "Thunderstorm"],
  [96, "Thunderstorm With Slight Hail"],
  [99, "Thunderstorm With Heavy Hail"],
]);

const timeOptions: Intl.DateTimeFormatOptions = {
  hour: "numeric",
};
const timeOptionsWithMin: Intl.DateTimeFormatOptions = {
  hour: "numeric",
  minute: "numeric",
};

const dayContainer = ref<HTMLElement | null>(null);

// onMounted(() => {
//   if (dayContainer.value !== null && props.hour.tense === "now") {
//     dayContainer.value.scrollIntoView({ block: "center", behavior: "smooth" });
//   }
// });

const tempPercent = computed(() => {
  if (props.options.useFeelLikeTemp) {
    const delta =
      props.weatherData.apparentTempRange.max -
      props.weatherData.apparentTempRange.min;
    return (
      ((props.hour.values.apparent_temperature -
        props.weatherData.apparentTempRange.min) /
        delta) *
      100
    );
  } else {
    const delta =
      props.weatherData.tempRange.max - props.weatherData.tempRange.min;
    return (
      ((props.hour.values.temperature_2m - props.weatherData.tempRange.min) /
        delta) *
      100
    );
  }
});

const precipitationPrecent = computed(() => {
  return (
    (props.hour.values.precipitation / props.weatherData.maxPrecipitation) * 100
  );
});

let sunRise = new Date(props.day.values.sunrise);
let sunSet = new Date(props.day.values.sunset);

if (sunSet.getDay() != props.day.date.getDay() && props.day.nextDay) {
  sunSet = new Date(props.day.nextDay.values.sunset);
}

const nextHour = new Date(props.hour.date).setHours(
  props.hour.date.getHours() + 1
);
const hourBeforeSunRise = +props.hour.date < +sunRise && +sunRise < +nextHour;
const hourBeforeSunSet = +props.hour.date < +sunSet && +sunSet < +nextHour;
</script>

<template>
  <article
    ref="dayContainer"
    :class="{
      hour: true,
      past: hour.tense === 'past',
      now: hour.tense === 'now',
      night_time: !(+sunRise < +hour.date && +hour.date < +sunSet),
    }"
  >
    <div class="info">
      <p v-if="hour.newWeatherCode || index === 0">
        {{ weatherCodeMap.get(hour.values.weathercode) }}
      </p>
      <p v-else>
        {{ hour.date.toLocaleString("en-us", timeOptions).toLowerCase() }}
      </p>
    </div>
    <div class="data"></div>
    <div class="temp_bar">
      <div class="spot" :style="{ left: `${tempPercent}%` }">
        <template v-if="index % 2 == 0">
          <p v-if="options.useFeelLikeTemp">
            {{ hour.values.apparent_temperature.toFixed(1) }}
            {{ hour.units.temperature_2m }}
          </p>
          <p v-else>
            {{ hour.values.temperature_2m.toFixed(1) }}
            {{ hour.units.temperature_2m }}
          </p>
        </template>
      </div>
      <div class="bar" :style="{ width: `${precipitationPrecent}%` }">
        <p v-if="hour.values.precipitation > 0 && (index + 1) % 2 == 0">
          {{ hour.values.precipitation }}
        </p>
      </div>
    </div>
  </article>
  <article class="golden_hour" v-if="hourBeforeSunRise">
    <p>
      {{ sunRise.toLocaleString("en-us", timeOptionsWithMin).toLowerCase() }}
      sun rise
    </p>
  </article>
  <article class="golden_hour" v-if="hourBeforeSunSet">
    <p>
      {{ sunSet.toLocaleString("en-us", timeOptionsWithMin).toLowerCase() }} sun
      set
    </p>
  </article>
</template>

<style lang="scss" scoped>
.hour {
  overflow: hidden;
  background-color: #b0d3ef;
  text-align: left;
  display: flex;
  padding: 0 1rem;
  z-index: 0;

  color: #222d;

  &.night_time {
    color: #dddd;
    background-color: #000c32;
  }

  &.past {
    // opacity: 0.5;
  }
  &.now {
    color: #222d;
    background-color: greenyellow;
    z-index: 10;
  }
}

.golden_hour {
  padding: 0 1rem;
  p {
    margin: 0;
    padding: 0.5rem;
  }
  background-color: #eab968;
}

.data {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  * {
    margin: 0;
  }
}
.info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0.5rem;
  p {
    margin: 0;
  }
}
.temp_bar {
  flex-basis: 35%;
  background-color: #fff2;
  position: relative;
  margin: 0 10px;

  .spot {
    background-color: #fff5;
    border-radius: 5px;
    // height: 100%;
    // width: 10px;
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0.2rem;

    > p {
      margin: 0;
      white-space: nowrap;
    }
  }
  .bar {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 0;
    background-color: rgba(92, 192, 223, 0.333);
    padding: 0.2rem 0;
    height: 100%;
    display: flex;
    border-radius: 0 5px 5px 0;
    justify-content: flex-end;
    align-items: center;

    > p {
      padding: 0.2rem;
      margin: 0;
      text-align: right;
      white-space: nowrap;
    }
  }
}
</style>
