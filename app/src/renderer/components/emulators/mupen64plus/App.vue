<template lang="html">
    <div class="column is-4">
        <div class="card">
            <div class="card-image">
                <figure class="image is-128x128">
                    <img src="./assets/logo.svg" alt="Mupen64Plus">
                </figure>
            </div>
            <div class="content has-text-centered">
                <p class="title is-3">Mupen64Plus</p>
                <span class="tag is-medium"
                    :class="[app.isRunning ? 'is-success' : 'is-danger']">
                    {{ app.isRunning ? 'running' : 'stopped' }}
                </span>
            </div>
            <footer class="card-footer">
                <a href="#" class="card-footer-item"
                    @click.prevent="start">Start</a>
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
import settings from 'electron-settings'
import { remote } from 'electron'
const dialog = remote.dialog
const app = remote.app
import forever from 'forever-monitor'
import path from 'path'

export default {
    name: 'mupen64plus-app',
    components: {
        Mupen64plusConfig
    },
    data () {
        return {
            config: {
                isActive: false
            },
            app: {
                isRunning: false,
                process: null
            }
        }
    },
    methods: {
        start () {
            settings.get('emulators.mupen64plus')
                .then(values => {
                    if (values.binary) {
                        this.chooseROM(values)
                    } else {
                        this.config.isActive = true
                    }
                })
        },
        chooseROM (params) {
            dialog.showOpenDialog({
                title: 'Choose a N64 Rom ...',
                properties: ['openFile'],
                filters: [
                    {
                        name: 'Nintendo 64 ROMs',
                        extensions: [
                            'bin',
                            'jap',
                            'n64',
                            'N64',
                            'pal',
                            'rom',
                            'u64',
                            'v64',
                            'usa',
                            'z64'
                        ]
                    }
                ]
            }, (filenames) => {
                if (filenames) {
                    const rom = filenames[0]
                    this.run(params, rom)
                }
            })
        },
        run (params, rom) {
            const cmd = [
                params.binary,
                `--${params.display}`,
                '--resolution',
                `${params.resolution}`,
                '--configdir',
                // TODO: allow race or directional pad configurations
                path.join(app.getPath('userData'), 'profiles/race/n64--default'),
                `${rom}`
            ]
            this.app.process = forever.start(cmd, {
                max: 1,
                cwd: path.dirname(params.binary),
                silent: true
            })
            this.app.process.on('start', () => {
                this.app.isRunning = true
            })
            this.app.process.on('exit', () => {
                this.app.isRunning = false
            })
            this.app.process.on('stdout', (data) => {
                this.$store.commit('appendLog', data.toString())
            })
            this.app.process.on('stderr', (data) => {
                this.$store.commit('appendLog', data.toString())
            })
        }
    },
    beforeDestroy () {
        if (this.app.process) {
            this.app.process.stop()
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
