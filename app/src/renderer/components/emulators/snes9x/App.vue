<template lang="html">
    <emulator-app
        name="Snes9x"
        :icon="app.icon"
        :isRunning="app.isRunning"
        @onStart="start"
        @onConfig="config.isActive = true">
        <snes9x-config slot="config"
            :isActive="config.isActive"
            @close="config.isActive = false"></snes9x-config>
    </emulator-app>
</template>

<script>
import EmulatorApp from 'components/emulators/EmulatorApp'
import Snes9xConfig from 'components/emulators/snes9x/Config'
import EmulatorMixin from 'components/mixins/EmulatorMixin'
import settings from 'electron-settings'
import { remote } from 'electron'
const dialog = remote.dialog
const app = remote.app
import forever from 'forever-monitor'
import path from 'path'

export default {
    name: 'snes9x-app',
    components: {
        EmulatorApp,
        Snes9xConfig
    },
    mixins: [
        EmulatorMixin
    ],
    data () {
        return {
            app: {
                icon: require('./assets/snes9x-logo.svg'),
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
            settings.get('emulators.snes9x')
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
                title: 'Choose a Super Nintendo Rom ...',
                properties: ['openFile'],
                filters: [
                    {
                        name: 'Super Nintendo ROMs',
                        extensions: [
                            'smc',
                            'SMC',
                            'fig',
                            'FIG',
                            'sfc',
                            'SFC',
                            'jma',
                            'JMA',
                            'zip',
                            'ZIP',
                            'gd3',
                            'GD3',
                            'swc',
                            'SWC',
                            'gz',
                            'GZ'
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
            this.configureProfile('snes--default')

            const cmd = [
                params.binary,
                '-conf',
                path.join(app.getPath('userData'), 'profiles/race/snes--default/snes9x.xml'),
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
