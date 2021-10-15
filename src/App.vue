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
    padding: .5rem 1rem;
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
</style>
