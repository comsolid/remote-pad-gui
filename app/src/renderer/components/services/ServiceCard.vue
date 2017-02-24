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
                        <p class="heading">PID</p>
                        <p class="title">{{pid}}</p>
                    </div>
                </div>
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
import bytes from 'prettier-bytes'
import usage from 'pidusage'
import { ipcRenderer } from 'electron'

export default {
    name: 'service-card',
    props: {
        description: {
            type: String,
            required: true
        },
        module: {
            type: String,
            required: true
        }
    },
    data () {
        return {
            status: 'stopped',
            memory: 0,
            bytes: 0,
            cpu: 0,
            interval: null,
            pid: -1
        }
    },
    mounted () {
        this.interval = setInterval(() => {
            this.monit()
        }, 1000)
        this.monit()

        ipcRenderer.on('process-pid', (event, result) => {
            if (result.module === this.module) {
                this.pid = result.pid
                this.status = 'online'
            }
        })
    },
    methods: {
        monit () {
            if (this.pid > 0) {
                usage.stat(this.pid, (err, stat) => {
                    if (err) {
                        console.log(err)
                        this.reset()
                    } else {
                        this.memory = bytes(stat.memory)
                        this.bytes = stat.memory
                        this.cpu = stat.cpu
                    }
                })
            }
        },
        restart () {
            this.reset()
            ipcRenderer.send('restart-process', this.module)
        },
        reset () {
            this.status = 'stopped'
            this.memory = 0
            this.bytes = 0
            this.cpu = 0
            this.pid = -1
        }
    },
    beforeDestroy () {
        clearInterval(this.interval)
        usage.unmonitor(this.pid)
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
