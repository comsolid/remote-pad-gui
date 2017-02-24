<template lang="html">
    <div class="container">
        <div class="notification" v-show="visible">
            <button type="button"
                class="delete"
                @click="visible = false"
            ></button>
            <div class="content">
                To access the Web Client open Google Chrome on your smartphone
                and type in the address bar
            </div>

            <div v-if="addresses.length === 1">
                <h3 class="title is-3">{{addresses[0]}}:8080</h3>
            </div>
            <div v-else>
                <p>
                    You have more than one network interface.<br>
                    Please choose one of the following to test.
                </p>
                <br>
                <ul>
                    <li v-for="value in addresses">{{value}}:8080</li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
import os from 'os'

export default {
    name: 'connection-notification',
    data () {
        return {
            visible: true,
            addresses: []
        }
    },
    mounted () {
        this.addresses = this.localIp()
    },
    methods: {
        localIp () {
            const interfaces = os.networkInterfaces()
            let addresses = []

            Object.keys(interfaces).forEach((el) => {
                interfaces[el].forEach((el2) => {
                    if (!el2.internal && el2.family === 'IPv4') {
                        addresses.push(el2.address)
                    }
                })
            })

            return addresses
        }
    }
}
</script>

<style lang="css">
</style>
