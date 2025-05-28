import { createStore } from 'vuex'

// global state for race round
export const store = createStore({
  state: () => ({
    round: 0,
    results: {},
    showResults: false,
    showHorseList: false,
  }),
  mutations: {
    increment(state) {
      state.round++
    },
    setResults(state, results) {
      state.results[state.round] = results
    },
    setShowResults(state, showResults) {
      state.showResults = showResults
    },
    setShowHorseList(state, showHorseList) {
      state.showHorseList = showHorseList
    },
  },
  actions: {
    increment({ commit }) {
      commit('increment')
    },

    setResults({ commit }, results) {
      commit('setResults', results)
    },
    setShowResults({ commit }, showResults) {
      commit('setShowResults', showResults)
    },

    setShowHorseList({ commit }, showHorseList) {
      commit('setShowHorseList', showHorseList)
    },
  },
})

export type RootState = ReturnType<typeof store.state>
export default store
