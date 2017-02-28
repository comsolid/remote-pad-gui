<template lang="html">
    <emulator-config-modal
        name="Snes9x"
        :isActive="isActive"
        @close="$emit('close')"
        @onSave="save">
        <div slot="form">
            <label class="label">Path to Snes9x binary</label>
            <p class="control has-addons">
                <input type="text" class="input is-expanded"
                    v-model="form.binary" />
                <a class="button is-info" @click="chooseBinary">
                    Browse...
                </a>
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
    name: 'snes9x-config',
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
            form: {
                binary: ''
            }
        }
    },
    mounted () {
        settings.get('emulators.snes9x')
            .then(values => {
                this.form = values
            })
    },
    methods: {
        save () {
            settings.set('emulators.snes9x', this.form)
                .then(() => {
                    this.$emit('close')
                })
        },
        chooseBinary () {
            dialog.showOpenDialog({
                title: 'Choose Snes9x binary...',
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
