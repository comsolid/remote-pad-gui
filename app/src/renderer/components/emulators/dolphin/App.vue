<template lang="html">
    <emulator-app
        name="Dolphin"
        :icon="app.icon"
        :isRunning="app.isRunning"
        @onStart="start"
        @onStop="stop"
        @onConfig="config.isActive = true"
        configType="one-time-configuration">
        <dolphin-config slot="config"
            :isActive="config.isActive"
            @close="config.isActive = false"
        ></dolphin-config>
    </emulator-app>
</template>

<script>
import EmulatorApp from 'components/emulators/EmulatorApp'
import DolphinConfig from 'components/emulators/dolphin/Config'
import EmulatorMixin from 'components/mixins/EmulatorMixin'
import settings from 'electron-settings'
import { remote } from 'electron'
const dialog = remote.dialog
import forever from 'forever-monitor'
import path from 'path'

export default {
    name: 'dolphin-app',
    components: {
        EmulatorApp,
        DolphinConfig
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
                icon: require('./assets/dolphin-logo.svg'),
                isRunning: false,
                process: null
            }
        }
    },
    methods: {
        start () {
            settings.get('emulators.dolphin')
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
                title: 'Choose a Game Cube ROM ...',
                properties: ['openFile'],
                filters: [
                    {
                        name: 'Nintendo Game Cube ROMs',
                        extensions: [
                            'elf',
                            'dol',
                            'gmc',
                            'iso',
                            'wbfs',
                            'ciso',
                            'gcz',
                            'wad'
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
            this.configureProfile('ngc--default')

            const cmd = [
                params.binary,
                '-e',
                rom
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

<style lang="css">
</style>
