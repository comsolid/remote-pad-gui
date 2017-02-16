<template lang="html">
    <section class="section">
        <div class="container">
            <div class="heading">
                <h2 class="subtitle has-text-centered">Services</h2>
            </div>
            <hr>
            <div class="columns">
                <div class="column">
                    <service-card
                        :description="services.web.description"></service-card>
                </div>
                <div class="column">
                    <service-card
                        :description="services.broker.description"></service-card>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import ServiceCard from 'components/home/ServiceCard'

export default {
    name: 'service-section',
    components: {
        ServiceCard
    },
    data () {
        return {
            services: {
                'web': {
                    'description': 'Web Server',
                    'status': 'stopped'
                },
                'broker': {
                    'description': 'MQTT Broker',
                    'status': 'stopped'
                }
            }
        }
    }
}
</script>

<style lang="css">
</style>
