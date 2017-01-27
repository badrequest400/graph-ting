import Vuex from 'vuex'

const store = new Vuex.Store({
  state: {
    chartData: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      series: [
        [5, 2, 4, 2, 0]
      ]
    },
    options: {
      width: 300,
      height: 200
    }
  }
})

export default store
