<script setup lang="ts">
defineProps<{
  percent: number;
  unit: string;
  windSpeeds?: number[];
}>();
</script>

<template>
  <div class="cloud">
    <template v-if="windSpeeds === undefined">
      <div
        class="clouds-bg abs"
        :style="{
          'background-image': `linear-gradient(
            to right,
            #fff0 ${50 - percent / 2}%,
            white ${50 - percent / 2}%,
            white ${50 + percent / 2}%,
            #fff0 ${50 + percent / 2}%
          )`,
        }"
      ></div>
    </template>
    <template v-else>
      <div class="abs animated">
        <div
          v-for="windSpeed in windSpeeds"
          class="clouds-bg"
          :style="{
            'background-image': `linear-gradient(
              to right,
              #fff0 ${50 - percent / 2}%,
              white ${50 - percent / 2}%,
              white ${50 + percent / 2}%,
              #fff0 ${50 + percent / 2}%
            )`,
            'animation-duration': `${((1 / windSpeed) * 100).toFixed(1)}s`,
          }"
        ></div>
      </div>
    </template>

    <p>
      {{ percent }}<sub>{{ unit }}</sub>
    </p>
  </div>
</template>

<style lang="scss" scoped>
.cloud {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  p {
    margin: 0.25rem;
    font-size: 1.2rem;
    font-weight: 800;
    opacity: 0.9;
  }
  sub {
    font-size: 0.6em;
    vertical-align: baseline;
    opacity: 0.5;
  }
  .abs {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    filter: blur(5px);
  }
  .clouds-bg {
    background-position: 25% 50%;
    background-size: calc(100%/3) 100%;
    opacity: 0.2;
  }
  .animated {
    display: flex;
    flex-direction: column;
    > .clouds-bg {
      flex: 1;
      width: 200%;
      background-position: 10% 50%;
      background-size: calc(100%/6) 100%;
      animation-name: scroll;
      animation-timing-function: linear;
      animation-duration: 5s;
      animation-iteration-count: infinite;
    }
    overflow: hidden;
  }

  @keyframes scroll {
    from {
      transform: translateX(-50%);
    }
    to {
      transform: translateX(0%);
    }
  }
}
</style>
