<template lang="html">
    <emulator-config-modal
        name="Mupen64Plus"
        :isActive="isActive"
        @close="$emit('close')"
        @onSave="save">
        <div slot="form">
            <label class="label">Path to Mupen64Plus binary</label>
            <p class="control has-addons">
                <input type="text" class="input is-expanded"
                    v-model="form.binary" />
                <a class="button is-info" @click="chooseBinary">
                    Browse...
                </a>
            </p>

            <label class="label">Display Mode</label>
            <p class="control">
                <label class="radio">
                    <input type="radio" v-model="form.display"
                        value="fullscreen">
                    Fullscreen Mode
                </label>
                <label class="radio">
                    <input type="radio" v-model="form.display"
                        value="windowed">
                    Windowed Mode
                </label>
            </p>

            <label class="label">Resolution</label>
            <p class="control">
                <span class="select">
                    <select v-model="form.resolution">
                        <option v-for="res in resolutions"
                            :value="res.value">
                            {{res.text}}
                        </option>
                    </select>
                </span>
            </p>
        </div>
    </emulator-config-modal>
</template>

<script>
import EmulatorConfigModal from 'components/emulators/EmulatorConfigModal'
import settings from 'electron-settings'
import { remote } from 'electron'
const dialog = remote.dialog

export default {
    name: 'mupen64plus-config',
    components: {
        EmulatorConfigModal
    },
    props: {
        isActive: {
            type: Boolean,
            required: true,
            default: false
        }
    },
    data () {
        return {
            resolutions: [
                {
                    value: '640x480',
                    text: '640x480 (4:3)'
                },
                {
                    value: '800x600',
                    text: '800x600 (4:3)'
                },
                {
                    value: '1024x768',
                    text: '1024x768 (4:3)'
                },
                {
                    value: '1152x864',
                    text: '1152x864 (4:3)'
                },
                {
                    value: '1440x900',
                    text: '1440x900 (16:10)'
                }
            ],
            form: {
                binary: '',
                resolution: '',
                display: ''
            }
        }
    },
    mounted () {
        settings.get('emulators.mupen64plus')
            .then(values => {
                this.form = values
            })
    },
    methods: {
        save () {
            settings.set('emulators.mupen64plus', this.form)
                .then(() => {
                    this.$emit('close')
                })
        },
        chooseBinary () {
            dialog.showOpenDialog({
                title: 'Choose Mupen64Plus binary...',
                properties: ['openFile']
            }, (filenames) => {
                if (filenames) {
                    this.form.binary = filenames[0]
                }
            })
        }
    }
}
</script>

<style lang="css">
</style>
