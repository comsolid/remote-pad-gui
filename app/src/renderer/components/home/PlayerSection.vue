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
import PlayerCard from 'components/home/PlayerCard'
import mqtt from 'mqtt'

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
            },
            client: null
        }
    },
    mounted () {
        const options = {
            username: 'gui',
            password: 'gui'
        }
        this.client = mqtt.connect('mqtt://localhost:1883', options)

        this.client.on('connect', () => {
            this.client.subscribe('gui/player', (err, granted) => {
                if (err) console.error(err)

                console.info('subscribed to', granted[0].topic)
            })

            this.client.on('message', (topic, payload) => {
                if (topic === 'gui/player') {
                    const player = JSON.parse(payload)
                    this.players[player.name].isConnected = player.connected
                }
            })
        })
    },
    beforeDestroy () {
        if (this.client) {
            this.client.end()
        }
    }
}
</script>

<style lang="css" scoped>
</style>
