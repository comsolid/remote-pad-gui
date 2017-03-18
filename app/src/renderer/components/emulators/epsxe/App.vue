<template lang="html">
    <emulator-app
        name="ePSXe"
        :icon="app.icon"
        :isRunning="app.isRunning"
        @onStart="start"
        @onConfig="config.isActive = true">
        <epsxe-config slot="config"
            :isActive="config.isActive"
            @close="config.isActive = false"></epsxe-config>
    </emulator-app>
</template>

<script>
import EmulatorApp from 'components/emulators/EmulatorApp'
import EmulatorMixin from 'components/mixins/EmulatorMixin'
import EpsxeConfig from 'components/emulators/epsxe/Config'
import settings from 'electron-settings'
import { remote } from 'electron'
const dialog = remote.dialog
// const app = remote.app
import forever from 'forever-monitor'
import path from 'path'

export default {
    name: 'epsxe-app',
    components: {
        EmulatorApp,
        EpsxeConfig
    },
    mixins: [
        EmulatorMixin
    ],
    data () {
        return {
            app: {
                icon: require('./assets/epsxe-logo.svg'),
                isRunning: false,
                process: null
            },
            config: {
                isActive: false
            }
        }
    },
    methods: {
        start () {
            settings.get('emulators.epsxe')
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
                title: 'Choose a Playstation Rom ...',
                properties: ['openFile'],
                filters: [
                    {
                        name: 'PlayStation ROMs',
                        extensions: [
                            'iso',
                            'ISO',
                            'bin',
                            'BIN'
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
            this.configureProfile('psx--default')

            // enable one time configuration
            // by copying the epsxerc to /home/$USER/.epsxe

            const cmd = [
                params.binary,
                '-nogui',
                '-fastboot',
                '-bios',
                params.bios,
                '-loadiso',
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
        }
    },
    beforeDestroy () {
        if (this.app.process) {
            this.app.process.stop()
        }
    }
}
</script>

<style lang="css">
</style>
