<template lang="html">
    <div class="card">
        <header class="card-header">
            <p class="card-header-title">
                {{description}}
                <span class="tag is-pulled-right"
                    :class="[status]">{{status}}</span>
            </p>
        </header>
        <div class="card-content">
            <nav class="level">
                <div class="level-item has-text-centered">
                    <div>
                        <p class="heading">Memory</p>
                        <p class="title">{{memory}}</p>
                    </div>
                </div>
                <div class="level-item has-text-centered">
                    <div>
                        <p class="heading">CPU</p>
                        <p class="title">{{cpu}}%</p>
                    </div>
                </div>
            </nav>
        </div>
        <footer class="card-footer">
            <a href="#" @click.prevent="restart()"
                class="card-footer-item">Restart</a>
        </footer>
    </div>
</template>

<script>
import pm2 from 'pm2'
import bytes from 'pretty-bytes'

export default {
    name: 'service-card',
    props: {
        description: {
            type: String,
            required: true
        },
        pm2service: {
            type: String,
            required: true
        }
    },
    data () {
        return {
            status: 'stopped',
            memory: 0,
            cpu: 0,
            interval: null
        }
    },
    mounted () {
        this.interval = setInterval(() => {
            this.monit()
        }, 1000)
        this.monit()
    },
    methods: {
        monit () {
            pm2.describe(this.pm2service, (err, procs) => {
                if (err) console.error(err)

                if (procs && procs.length > 0) {
                    this.status = procs[0].pm2_env.status
                    this.memory = bytes(procs[0].monit.memory)
                    this.cpu = procs[0].monit.cpu
                }
            })
        },
        restart () {
            this.status = 'stopped'
            this.memory = 0
            this.cpu = 0
            pm2.restart(this.pm2service, (err, ret) => {
                if (err) console.error(err)
            })
        }
    },
    beforeDestroy () {
        clearInterval(this.interval)
    }
}
</script>

<style lang="css" scoped>
.card-header-title {
    justify-content: space-between;
}

.online {
    background-color: #23d160;
    color: #fff;
}

.stopped {
    background-color: #ff3860;
    color: #fff;
}
</style>
