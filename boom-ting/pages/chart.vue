<template>
  <section class="container">
    <img src="../assets/img/logo.png" alt="Nuxt.js Logo" class="logo" />
    <h1 class="title">
      Chartist Vue test
    </h1>
    <div class="ct-chart ct-perfect-fourth"></div>
    <nuxt-link class="button" to="/about">
      About page
    </nuxt-link>
  </section>
</template>

<script>
export default {
  data ({ store: { state } }) {
    return state['chartData']
  }
}

if (typeof window !== 'undefined') {
  const Chartist = require('chartist')
  new Chartist.Line('.ct-chart', window.__NUXT__.data[0])
}

</script>

<style scoped>
  .title {
    margin: 50px 0;
  }
</style>
