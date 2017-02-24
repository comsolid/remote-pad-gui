<template lang="html">
    <div>
        <connection-notification></connection-notification>
        <player-section></player-section>
        <service-section></service-section>
    </div>
</template>

<script>
import PlayerSection from 'components/services/PlayerSection'
import ServiceSection from 'components/services/ServiceSection'
import ConnectionNotification from 'components/services/ConnectionNotification'

export default {
    name: 'service-content',
    components: {
        PlayerSection,
        ServiceSection,
        ConnectionNotification
    }
}
</script>

<style lang="css">
</style>
