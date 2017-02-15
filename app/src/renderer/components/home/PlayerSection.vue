<template lang="html">
    <section class="section">
        <div class="container">
            <div class="heading">
                <h1 class="title has-text-centered">Players</h1>
            </div>
            <hr>
            <div class="columns">
                <div class="column" v-for="p in players">
                    <player-card :name="p.name"
                        :number="p.number"></player-card>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import PlayerCard from 'components/home/PlayerCard'

export default {
    name: 'player-section',
    components: {
        PlayerCard
    },
    data () {
        return {
            players: [
                {
                    name: 'alice',
                    number: 1
                },
                {
                    name: 'bob',
                    number: 2
                },
                {
                    name: 'carol',
                    number: 3
                },
                {
                    name: 'david',
                    number: 4
                }
            ]
        }
    }
}
</script>

<style lang="css" scoped>
</style>
