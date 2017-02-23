<template lang="html">
    <div class="card is-fullwidth player-card">
        <div class="card-image">
            <figure class="image is-128x128">
                <img :src="image()" alt="player">
            </figure>
        </div>
        <div class="card-content">
            <div class="content is-medium capitalize has-text-centered">
                <p class="title">Player {{number}}</p>
                <span class="tag is-medium"
                    :class="[isConnected ? 'is-success' : 'is-danger']"
                >{{ isConnected ? 'C' : 'D' }} - {{name}}</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'player-card',
    props: {
        name: {
            type: String,
            required: true
        },
        number: {
            type: Number,
            required: true
        },
        isConnected: {
            type: Boolean,
            required: true,
            default: false
        }
    },
    methods: {
        image () {
            return require(`./assets/${this.name}.png`)
        }
    }
}
</script>

<style lang="css" scoped>
.capitalize {
    text-transform: capitalize;
}
.player-card {
    display: flex;
    flex-direction: column;
    align-items: center;
}
</style>
