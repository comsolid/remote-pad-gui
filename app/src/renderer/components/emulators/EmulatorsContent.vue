<template lang="html">
    <div class="container">
        <div class="heading">
            <h2 class="subtitle has-text-centered">Emulators</h2>
        </div>
        <hr>
        <div class="columns">
            <mupen64plus-app></mupen64plus-app>
        </div>
    </div>
</template>

<script>
import Mupen64plusApp from 'components/emulators/mupen64plus/App'

export default {
    name: 'emulators-content',
    components: {
        Mupen64plusApp
    }
}
</script>

<style lang="css">
</style>
