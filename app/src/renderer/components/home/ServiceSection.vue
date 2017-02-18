<template lang="html">
    <div class="container">
        <div class="heading">
            <h2 class="subtitle has-text-centered">Services</h2>
        </div>
        <hr>
        <div class="columns">
            <div class="column">
                <service-card
                    :description="services.web.description"
                    :pm2service="services.web.pm2service"
                ></service-card>
            </div>
            <div class="column">
                <service-card
                    :description="services.broker.description"
                    :pm2service="services.broker.pm2service"
                ></service-card>
            </div>
        </div>
    </div>
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
                    'pm2service': 'remote-pad'
                },
                'broker': {
                    'description': 'MQTT Broker',
                    'pm2service': 'remote-pad-server'
                }
            }
        }
    }
}
</script>

<style lang="css">
</style>
