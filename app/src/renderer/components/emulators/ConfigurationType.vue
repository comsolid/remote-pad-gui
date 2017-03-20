<template lang="html">
    <div class="root">
        <span class="tag" :class="[color]">{{text}}</span>
    </div>
</template>

<script>
export default {
    name: 'configuration-type',
    props: {
        type: {
            type: String,
            required: false,
            default: 'plug-and-play'
        }
    },
    data () {
        return {
            text: 'Undefined type',
            color: 'is-danger',
            types: {
                'plug-and-play': {
                    text: 'Plug and Play',
                    color: 'is-success'
                },
                'one-time-configuration': {
                    text: 'One Time Configuration',
                    color: 'is-warning'
                },
                'manual': {
                    text: 'Manual',
                    color: 'is-dark'
                }
            }
        }
    },
    mounted () {
        if (this.types[this.type]) {
            this.text = this.types[this.type].text
            this.color = this.types[this.type].color
        }
    }
}
</script>

<style lang="css" scoped>
.root {
    display: flex;
    margin: 10px auto;
}
</style>
