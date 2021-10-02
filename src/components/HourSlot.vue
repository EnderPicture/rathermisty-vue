<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { WeatherHour } from "../interfaces/WeatherData";

const props = defineProps<{
  hour: WeatherHour;
  minTemp: number;
  maxTemp: number;
  useFeelslike: boolean;
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

const dayContainer = ref<HTMLElement | null>(null);

onMounted(() => {
  if (dayContainer.value !== null && props.hour.tense === "now") {
    dayContainer.value.scrollIntoView({ block: "center", behavior: "smooth" });
  }
});

const tempPercent = computed(() => {
  const delta = props.maxTemp - props.minTemp;
  if (props.useFeelslike) {
    return ((props.maxTemp - props.hour.feelLikeTemp) / delta) * 100;
  } else {
    return ((props.maxTemp - props.hour.temp) / delta) * 100;
  }
});
</script>

<template>
  <div
    ref="dayContainer"
    :class="{
      hour: true,
      past: hour.tense === 'past',
      now: hour.tense === 'now',
    }"
  >
    <div class="info">
      <p>
        {{ hour.time.toLocaleString("en-us", timeOptions) }}
      </p>
      <p v-if="hour.newWeather">
        {{ weatherCodeMap.get(hour.weatherCode) }}
      </p>
    </div>
    <div class="data">
      <p v-if="useFeelslike">
        {{ hour.feelLikeTemp.toFixed(1) }} {{ hour.tempUnit }}
      </p>
      <p v-else>{{ hour.temp.toFixed(1) }} {{ hour.tempUnit }}</p>
      <p v-if="hour.precipitation > 0">{{ hour.precipitation }} {{ hour.precipitationUnit }}</p>
    </div>
    <div class="temp-bar">
      <div class="spot" :style="{ right: `${tempPercent}%` }"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.hour {
  background-color: antiquewhite;
  text-align: left;
  display: flex;
  padding: 0 1rem;
  
  &+.hour {
    border-top: solid 1px #ddd;
  }
  &.past {
    opacity: 0.5;
  }
  &.now {
    background-color: azure;
  }
}

.data {
  display: flex;
  flex-direction: column;
  justify-content: center;
  * {
    text-align: right;
    margin: 0;
  }
}
.info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0.5rem;
  p {
    margin: 0;
  }
}
.temp-bar {
  flex-basis: 35%;
  background-color: gray;
  position: relative;
  margin: 0 10px;

  .spot {
    background-color: black;
    height: 100%;
    width: 10px;
    position: absolute;
    top: 0;
    transform: translateX(50%);
  }
}
</style>
