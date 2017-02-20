
import service from '../services/store'

const store = service()
const state = store.state
const mutations = store.mutations

export default {
    state,
    mutations
}
