<template lang="html">
    <div v-show="currentLog !== ''">
        <div class="heading">
            <h4 class="subtitle is-h4">
                Logs
                <button class="button is-pulled-right"
                    @click.prevent="clear">Clear</button>
            </h4>
            <hr>
        </div>
        <div class="container">
            <pre><code>{{currentLog}}</code></pre>
        </div>
    </div>
</template>

<script>
export default {
    name: 'emulators-log',
    computed: {
        currentLog () {
            return this.$store.getters.currentLog
        }
    },
    methods: {
        clear () {
            this.$store.commit('clearLog')
        }
    }
}
</script>

<style lang="css" scoped>
code {
    max-height: 300px;
    overflow: scroll;
}
</style>
