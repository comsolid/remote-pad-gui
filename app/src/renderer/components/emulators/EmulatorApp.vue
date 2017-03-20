<template lang="html">
    <div class="column is-4">
        <div class="card">
            <configuration-type :type="configType"></configuration-type>
            <div class="card-image">
                <figure class="image is-128x128">
                    <img :src="icon" :alt="name">
                </figure>
            </div>
            <div class="content has-text-centered">
                <p class="title is-3" v-once>{{name}}</p>
                <span class="tag is-medium"
                    :class="[isRunning ? 'is-success' : 'is-danger']">
                    {{ isRunning ? 'Running' : 'Stopped' }}
                </span>
            </div>
            <footer class="card-footer">
                <a href="#" class="card-footer-item"
                    @click.prevent="emitStart">Start</a>
                <a href="#" class="card-footer-item"
                    @click.prevent="emitConfig">
                    Config
                </a>
            </footer>
        </div>
        <slot name="config"></slot>
    </div>
</template>

<script>
import ConfigurationType from 'components/emulators/ConfigurationType'

// abstract emulator app
export default {
    name: 'emulator-app',
    components: {
        ConfigurationType
    },
    props: {
        name: {
            type: String,
            required: true
        },
        icon: {
            type: String,
            required: true
        },
        isRunning: {
            type: Boolean,
            required: true,
            default: false
        },
        configType: {
            type: String,
            required: true
        }
    },
    methods: {
        emitStart () {
            this.$emit('onStart')
        },
        emitConfig () {
            this.$emit('onConfig')
        }
    }
}
</script>

<style lang="css" scoped>
.card {
    display: flex;
    flex-direction: column;
    align-items: center;
}
.card-footer {
    align-self: stretch;
}
</style>
