
export default () => {
    return {
        state: {
            pid: null
        },
        mutations: {
            SET_PID (state, payload) {
                state.pid = payload
            }
        }
    }
}
