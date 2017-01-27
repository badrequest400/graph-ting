<template>
  <section class="container">
    <h1 class="title">
      Chartist Vue test
    </h1>
    <div class="chart">
      <div class="ct-chart ct-perfect-fourth"></div>
    </div>
    <nuxt-link class="button" to="/about">
      About page
    </nuxt-link>
  </section>
</template>

<script>
export default {
  data ({ store: { state } }) {
    const { chartData, options } = state
    return {
      chartData,
      options
    }
  }
}

if (typeof window !== 'undefined') {
  const Chartist = require('chartist')
  const { chartData, options } = window.__NUXT__.data[0] 
  new Chartist.Line('.ct-chart', chartData, options)
}

</script>

<style scoped>
  .title {
    margin: 50px 0;
  }
  .ct-perfect-fourth {
    width: 300px;
    height: 200px;
  }
  .chart {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
  }
</style>
