<template lang="html">
    <emulator-config-modal
        name="Dolphin"
        :isActive="isActive"
        :isSaving="isSaving"
        @close="$emit('close')"
        @onSave="save">
        <div slot="form">
            <label class="label">Path to Dolphin binary</label>
            <div class="field has-addons">
                <p class="control is-expanded">
                    <input type="text" class="input is-expanded"
                    v-model="form.binary" />
                </p>
                <p class="control">
                    <a class="button is-info" @click="chooseBinary">
                        Browse...
                    </a>
                </p>
            </div>

            <div class="field">
                <p class="control">
                    <label class="checkbox">
                        <input type="checkbox"
                            v-model="form.ignorePreviousConfiguration">
                        Ignore previous configuration?
                    </label>
                </p>
            </div>
        </div>
    </emulator-config-modal>
</template>

<script>
import EmulatorConfigModal from 'components/emulators/EmulatorConfigModal'
import settings from 'electron-settings'
import { remote } from 'electron'
import mkdirp from 'mkdirp'
import saveConfig from './save-config'
import path from 'path'
import fs from 'fs'

const dialog = remote.dialog
const app = remote.app
const CONFIG_FILE = path.join(
    app.getPath('home'),
    '.config/dolphin-emu/GCPadNew.ini'
)

export default {
    name: 'dolphin-config',
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
            isSaving: false,
            form: {
                binary: '',
                ignorePreviousConfiguration: false
            }
        }
    },
    mounted () {
        settings.get('emulators.dolphin')
            .then(values => {
                this.form = values
            })
    },
    methods: {
        save () {
            this.isSaving = true
            settings.set('emulators.dolphin', this.form)
                .then(() => {
                    return this.checkEmulatorDirectory()
                })
                .then(() => {
                    return this.checkPreviousConfiguration()
                })
                .then(() => {
                    const filepath = path.join(
                        app.getPath('userData'),
                        // TODO: enable user to configure which pad
                        // type he wants. In this scenario he always
                        // gets directional
                        'profiles/directional/ngc--default/GCPadNew.ini'
                    )
                    const outfilepath = CONFIG_FILE
                    return saveConfig(filepath, outfilepath)
                })
                .then(() => {
                    this.isSaving = false
                    this.$emit('close')
                })
                .catch((err) => {
                    this.isSaving = false
                    console.log(err)
                })
        },
        chooseBinary () {
            dialog.showOpenDialog({
                title: 'Choose Dolphin binary...',
                properties: ['openFile']
            }, (filenames) => {
                if (filenames) {
                    this.form.binary = filenames[0]
                }
            })
        },
        checkEmulatorDirectory () {
            return new Promise((resolve, reject) => {
                const dir = path.join(
                    app.getPath('home'),
                    '.config/dolphin-emu/'
                )
                mkdirp(dir, (err) => {
                    if (err) {
                        if (err.code === 'EEXIST') {
                            return resolve()
                        }
                        return reject(err)
                    }
                    return resolve()
                })
            })
        },
        checkPreviousConfiguration () {
            return new Promise((resolve, reject) => {
                if (this.form.ignorePreviousConfiguration) {
                    return resolve()
                }

                fs.access(CONFIG_FILE, fs.constants.F_OK, (err) => {
                    if (err) {
                        // if the file does not exists, there's no need for backup
                        return resolve()
                    }
                    dialog.showMessageBox({
                        type: 'question',
                        buttons: [
                            'Ignore',
                            'Backup'
                        ],
                        defaultId: 1,
                        message: 'Previous configuration for Dolphin Emulator found. Do you wish to make a backup?',
                        cancelId: 0
                    }, (response) => {
                        if (response === 1) {
                            this.backupPreviousConfiguration()
                                .then(() => {
                                    resolve()
                                })
                                .catch((err) => {
                                    reject(err)
                                })
                        } else {
                            resolve()
                        }
                    })
                })
            })
        },
        backupPreviousConfiguration () {
            return new Promise((resolve, reject) => {
                dialog.showSaveDialog({
                    title: 'Save previous Dolphin configuration',
                    defaultPath: app.getPath('documents')
                }, (filename) => {
                    if (filename) {
                        const readable = fs.createReadStream(CONFIG_FILE)
                        const writable = fs.createWriteStream(filename)
                        const cleanup = (err) => {
                            readable.destroy()
                            writable.end()
                            reject(err)
                        }
                        readable.on('error', cleanup)
                        writable.on('error', cleanup)
                        writable.on('finish', () => {
                            resolve()
                        })
                        readable.pipe(writable)
                    } else {
                        reject('Canceled by the user')
                    }
                })
            })
        }
    }
}
</script>

<style lang="css">
</style>
