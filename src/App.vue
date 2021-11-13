<script setup lang="ts">
import ReloadPrompt from "./components/ReloadPrompt.vue";
</script>

<template>
  <!-- <div class="nav">
    <router-link to="/">home</router-link>
    <router-link to="/about">about</router-link>
  </div> -->
  <router-view />
  <ReloadPrompt />
</template>

<style lang="scss">
* {
  box-sizing: border-box;
}

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

  background-color: #000;

  /* overflow-y: scroll; */
}
#app {
  font-family: Montserrat, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  scroll-behavior: smooth;
}
</style>
