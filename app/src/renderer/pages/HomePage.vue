<template lang="html">
    <main-menu>
        <main-content label="Services" :selected="true">
            <section class="section">
                <keep-alive>
                    <service-content></service-content>
                </keep-alive>
            </section>
        </main-content>
        <main-content label="Emulators">
            <section class="section">
                <emulators-content></emulators-content>
            </section>
        </main-content>
    </main-menu>
</template>

<script>
import MainMenu from 'components/main/MainMenu'
import MainContent from 'components/main/MainContent'
import ServiceContent from 'components/services/ServiceContent'
import EmulatorsContent from 'components/emulators/EmulatorsContent'

// TODO: https://vuejs.org/v2/guide/components.html#Dynamic-Components
// with keep-alive
// https://gist.github.com/JeffreyWay/f844ca4dd1887d566759849665068162
// https://laracasts.com/series/learn-vue-2-step-by-step/episodes/11
export default {
    name: 'home-page',
    components: {
        MainMenu,
        MainContent,
        ServiceContent,
        EmulatorsContent
    }
}
</script>

<style lang="css" scoped>
</style>
