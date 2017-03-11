<template lang="html">
    <section class="section">
        <div class="container">
            <div class="heading">
                <h2 class="subtitle has-text-centered">Players</h2>
            </div>
            <hr>
            <div class="columns">
                <div class="column" v-for="p in players">
                    <player-card :name="p.name"
                        :number="p.number"
                        :isConnected="p.isConnected"></player-card>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import PlayerCard from 'components/services/PlayerCard'

export default {
    name: 'player-section',
    components: {
        PlayerCard
    },
    data () {
        return {
            players: {
                alice: {
                    name: 'alice',
                    number: 1,
                    isConnected: false
                },
                bob: {
                    name: 'bob',
                    number: 2,
                    isConnected: false
                },
                carol: {
                    name: 'carol',
                    number: 3,
                    isConnected: false
                },
                david: {
                    name: 'david',
                    number: 4,
                    isConnected: false
                }
            }
        }
    },
    mounted () {
        const client = this.$store.getters.mqtt
        client.on('connect', () => {
            client.subscribe('gui/player', (err, granted) => {
                if (err) console.error(err)

                console.info('subscribed to', granted[0].topic)
            })

            client.on('message', (topic, payload) => {
                if (topic === 'gui/player') {
                    const player = JSON.parse(payload)
                    this.players[player.name].isConnected = player.connected
                }
            })
        })
    }
}
</script>

<style lang="css" scoped>
</style>
