<script setup lang="ts">
const props = defineProps<{
  percent: number;
  unit: string;
}>();
</script>

<template>
  <div class="cloud">
    <div
      class="clouds-bg"
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
    <p>
      {{ percent }}<sub>{{ unit }}</sub>
    </p>
  </div>
</template>

<style lang="scss" scoped>
p {
  margin: 0.5rem;
  font-size: 1.5rem;
  font-weight: 800;
  opacity: 0.9;
}
sub {
  font-size: 0.6em;
  vertical-align: baseline;
  opacity: 0.5;
}
.cloud {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  .clouds-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-position: bottom left;
    background-size: 20% 100%;
    background-repeat: repeat-x;
    opacity: 0.2;
    filter: blur(5px);
  }
}
</style>
