<template lang="html">
    <div class="container">
        <article class="message is-primary">
            <div class="message-header">
                <p class="title is-3 is-white">Welcome to Remote Pad</p>
            </div>
            <div class="message-body">
                To access the Controller open <b>Google Chrome</b>
                on your smartphone and type in the address bar

                <div v-if="addresses.length === 0">
                    <p>
                        Network interface not found. Please, check
                        if your computer is connected to a network.
                    </p>
                </div>
                <div v-else-if="addresses.length === 1">
                    <h3 class="title has-padding-top is-bold">
                        {{addresses[0]}}:8080
                    </h3>
                </div>
                <div v-else>
                    <p>
                        You have more than one network interface.<br>
                        Please choose one of the following.
                    </p>
                    <ul class="has-padding-top">
                        <li v-for="value in addresses">
                            <b>{{value}}:8080</b>
                        </li>
                    </ul>
                </div>
                <p class="has-padding-top">
                    <button class="button is-primary is-outlined"
                        :class="{'is-loading': isLoading}"
                        @click.prevent="reload">Reload</button>
                </p>
            </div>
        </article>
    </div>
</template>

<script>
import os from 'os'

export default {
    name: 'connection-notification',
    data () {
        return {
            addresses: [],
            isLoading: true
        }
    },
    mounted () {
        this.reload()
    },
    methods: {
        localIp () {
            this.isLoading = true
            const interfaces = os.networkInterfaces()
            let addresses = []

            Object.keys(interfaces).forEach((el) => {
                interfaces[el].forEach((el2) => {
                    if (!el2.internal && el2.family === 'IPv4') {
                        addresses.push(el2.address)
                    }
                })
            })
            this.isLoading = false
            return addresses
        },
        reload () {
            this.addresses = this.localIp()
        }
    }
}
</script>

<style lang="css" scoped>
.has-padding-top {
    padding-top: 1.25rem;
}
.is-white {
    color: whitesmoke;
    font-weight: bold;
}
.is-bold {
    font-weight: bold
}
</style>
