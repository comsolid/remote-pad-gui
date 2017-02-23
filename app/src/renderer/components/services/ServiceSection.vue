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
                    :module="services.web.module"
                ></service-card>
            </div>
            <div class="column">
                <service-card
                    :description="services.broker.description"
                    :module="services.broker.module"
                ></service-card>
            </div>
        </div>
    </div>
</template>

<script>
import ServiceCard from 'components/services/ServiceCard'

export default {
    name: 'service-section',
    components: {
        ServiceCard
    },
    data () {
        return {
            services: {
                web: {
                    description: 'Web Server',
                    module: 'web'
                },
                broker: {
                    description: 'MQTT Broker',
                    module: 'broker'
                }
            }
        }
    }
}
</script>

<style lang="css">
</style>
