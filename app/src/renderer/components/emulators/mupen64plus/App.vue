<template lang="html">
    <emulator-app
        name="Mupen64Plus"
        :icon="app.icon"
        :isRunning="app.isRunning"
        @onStart="start"
        @onStop="stop"
        @onConfig="config.isActive = true"
        configType="plug-and-play">
        <mupen64plus-config slot="config"
            :isActive="config.isActive"
            @close="config.isActive = false"
        ></mupen64plus-config>
    </emulator-app>
</template>

<script>
import EmulatorApp from 'components/emulators/EmulatorApp'
import Mupen64plusConfig from 'components/emulators/mupen64plus/Config'
import EmulatorMixin from 'components/mixins/EmulatorMixin'
import settings from 'electron-settings'
import { remote } from 'electron'
const dialog = remote.dialog
const app = remote.app
import forever from 'forever-monitor'
import path from 'path'

export default {
    name: 'mupen64plus-app',
    components: {
        EmulatorApp,
        Mupen64plusConfig
    },
    mixins: [
        EmulatorMixin
    ],
    data () {
        return {
            config: {
                isActive: false
            },
            app: {
                icon: require('./assets/mupen64plus-logo.svg'),
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
            this.configureProfile('n64--default')

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
        },
        stop () {
            if (this.app.process) {
                this.app.process.stop()
            }
        }
    },
    beforeDestroy () {
        this.stop()
    }
}
</script>

<style lang="css" scoped>
</style>
