
import mqtt from 'mqtt'

export default {
    data () {
        return {
            client: null
        }
    },
    mounted () {
        const options = {
            username: 'gui',
            password: 'gui'
        }
        this.client = mqtt.connect('mqtt://localhost:1883', options)
    },
    methods: {
        configureProfile (profile) {
            console.log('Configuring profile...')
            this.client.publish('gui/profile', profile, {
                qos: 1
            }, (err) => {
                if (err) console.error(err)
                else console.log(`profile ${profile} set`)
            })
        }
    },
    beforeDestroy () {
        if (this.client) {
            this.client.end()
        }
    }
}
