<template lang="html">
    <div>
        <player-section></player-section>
        <service-section></service-section>
    </div>
</template>

<script>
import PlayerSection from 'components/home/PlayerSection'
import ServiceSection from 'components/home/ServiceSection'

export default {
    name: 'home-page',
    components: {
        PlayerSection,
        ServiceSection
    }
}
</script>

<style lang="css" scoped>
</style>
