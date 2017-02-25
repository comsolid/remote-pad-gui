import Vue from 'vue'
import Vuex from 'vuex'

// import * as actions from './actions'
// import * as getters from './getters'
// import modules from './modules'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        emulators: {
            log: ''
        }
    },
    mutations: {
        appendLog (state, data) {
            state.emulators.log += data
        },
        clearLog (state) {
            state.emulators.log = ''
        }
    },
    getters: {
        currentLog: (state) => {
            return state.emulators.log
        }
    },
    // actions,
    // getters,
    // modules,
    strict: true
})
