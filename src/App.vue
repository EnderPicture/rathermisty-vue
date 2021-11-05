<script setup lang="ts">
// if (window.location.href.substr(0, 5) !== "https") {
//   window.location.href = window.location.href.replace("http", "https");
// }
</script>

<template>
  <div class="nav">
    <router-link to="/">home</router-link>
    <router-link to="/about">about</router-link>
  </div>
  <router-view />

  <div class="test"></div>
  <svg height="0" width="0">
    <filter id="blurMe">
      <feOffset in="SourceGraphic" dx="-20" dy="0" result="off1" />
      <feOffset in="SourceGraphic" dx="20" dy="0" result="off2" />
      <feOffset in="SourceGraphic" dx="0" dy="20" result="off3" />
      <feOffset in="SourceGraphic" dx="0" dy="-20" result="off4" />

        <feMerge result="merged">
          <feMergeNode in="off1" />
          <feMergeNode in="off2" />
          <feMergeNode in="off3" />
          <feMergeNode in="off4" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      <feGaussianBlur stdDeviation="10" />

    </filter>
  </svg>
</template>

<style lang="scss">
* {
  box-sizing: border-box;
}
/* html {
  overflow-y: scroll;
} */

.nav {
  display: flex;
  justify-content: center;
  > a {
    padding: 0.5rem 1rem;
  }
}

body {
  margin: 0;

  margin-right: calc(100% - 100vw);
  overflow-x: hidden;

  /* overflow-y: scroll; */
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  scroll-behavior: smooth;
}

.test {
  // border: solid 1px red;
  position: fixed;
  top: 100px;
  left: 50%;
  z-index: 100;
  width: 200px;
  height: 200px;
  backdrop-filter: url(#blurMe);
}
</style>
