<template lang="html">
    <section class="section">
        <connection-notification></connection-notification>
        <player-section></player-section>
        <service-section></service-section>
    </section>
</template>

<script>
import PlayerSection from 'components/home/PlayerSection'
import ServiceSection from 'components/home/ServiceSection'
import ConnectionNotification from 'components/home/ConnectionNotification'

export default {
    name: 'home-page',
    components: {
        PlayerSection,
        ServiceSection,
        ConnectionNotification
    }
}
</script>

<style lang="css" scoped>
</style>
