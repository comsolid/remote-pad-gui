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
