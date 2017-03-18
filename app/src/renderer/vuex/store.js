import Vue from 'vue'
import Vuex from 'vuex'
import mqtt from 'mqtt'

const options = {
    username: 'gui',
    password: 'gui'
}

const client = mqtt.connect('mqtt://localhost:1883', options)
client.on('connect', () => {
    console.log('connected')
})

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
        },
        mqtt: () => {
            return client
        }
    },
    // actions,
    // getters,
    // modules,
    strict: true
})
