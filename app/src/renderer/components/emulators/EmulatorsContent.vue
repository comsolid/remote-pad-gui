<template lang="html">
    <div class="container">
        <div class="heading">
            <h2 class="subtitle has-text-centered">Emulators</h2>
        </div>
        <hr>
        <div class="columns">
            <dolphin-app></dolphin-app>
            <mupen64plus-app></mupen64plus-app>
            <snes9x-app></snes9x-app>
        </div>
        <div class="columns is-centered">
            <epsxe-app></epsxe-app>
        </div>
        <emulators-log></emulators-log>
    </div>
</template>

<script>
import Mupen64plusApp from 'components/emulators/mupen64plus/App'
import Snes9xApp from 'components/emulators/snes9x/App'
import EpsxeApp from 'components/emulators/epsxe/App'
import DolphinApp from 'components/emulators/dolphin/App'
import EmulatorsLog from 'components/emulators/Log'

export default {
    name: 'emulators-content',
    components: {
        Mupen64plusApp,
        Snes9xApp,
        EpsxeApp,
        DolphinApp,
        EmulatorsLog
    }
}
</script>

<style lang="css" scoped>
.is-centered {
    display: flex;
    justify-content: center;
}
</style>
