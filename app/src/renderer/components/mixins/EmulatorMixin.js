
export default {
    methods: {
        configureProfile (profile) {
            console.log('Configuring profile...')
            const client = this.$store.getters.mqtt
            client.publish('gui/profile', profile, {
                qos: 1
            }, (err) => {
                if (err) console.error(err)
                else console.log(`profile ${profile} set`)
            })
        }
    }
}
