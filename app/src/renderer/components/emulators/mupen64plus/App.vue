<template lang="html">
    <div class="column is-4">
        <div class="card">
            <div class="card-image">
                <figure class="image is-128x128">
                    <img src="./assets/logo.svg" alt="Mupen64Plus">
                </figure>
            </div>
            <div class="content">
                <p class="title is-3">Mupen64Plus</p>
            </div>
            <footer class="card-footer">
                <a href="#" class="card-footer-item">Start</a>
                <a href="#" class="card-footer-item"
                    @click.prevent="config.isActive = true">
                    Config
                </a>
            </footer>
        </div>
        <mupen64plus-config
            :isActive="config.isActive"
            @close="config.isActive = false"
        ></mupen64plus-config>
    </div>
</template>

<script>
import Mupen64plusConfig from 'components/emulators/mupen64plus/Config'

export default {
    name: 'mupen64plus-app',
    components: {
        Mupen64plusConfig
    },
    data () {
        return {
            config: {
                isActive: false
            }
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
