<template lang="html">
    <emulator-config-modal
        name="ePSXe"
        :isActive="isActive"
        :isSaving="isSaving"
        @close="$emit('close')"
        @onSave="save">
        <div slot="form">
            <label class="label">Path to ePSXe binary</label>
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

            <label class="label">Path to PlayStation BIOS</label>
            <div class="field has-addons">
                <p class="control is-expanded">
                    <input type="text" class="input is-expanded"
                    v-model="form.bios" />
                </p>
                <p class="control">
                    <a class="button is-info" @click="chooseBios">
                        Browse...
                    </a>
                </p>
            </div>

            <div class="field">
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
            </div>

            <div class="field">
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
import path from 'path'
import fs from 'fs'
import saveConfig from './save-config'
import { remote } from 'electron'

const dialog = remote.dialog
const app = remote.app

export default {
    name: 'epsxe-config',
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
                bios: '',
                resolution: '',
                display: '',
                ignorePreviousConfiguration: false
            },
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
            ]
        }
    },
    mounted () {
        settings.get('emulators.epsxe')
            .then(values => {
                this.form = values
            })
    },
    methods: {
        save () {
            this.isSaving = true
            settings.set('emulators.epsxe', this.form)
                .then(() => {
                    return this.checkEmulatorDirectory()
                })
                .then(() => {
                    return this.checkPreviousConfiguration()
                })
                .then(() => {
                    const filepath = path.join(
                        app.getPath('userData'),
                        'profiles/race/psx--default/epsxerc'
                    )
                    const outfilepath = path.join(
                        app.getPath('home'),
                        '.epsxe/epsxerc'
                    )
                    return saveConfig(filepath, this.form, outfilepath)
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
                title: 'Choose ePSXe binary...',
                properties: ['openFile']
            }, (filenames) => {
                if (filenames) {
                    this.form.binary = filenames[0]
                }
            })
        },
        chooseBios () {
            dialog.showOpenDialog({
                title: 'Choose PlayStation BIOS...',
                properties: ['openFile'],
                filters: [
                    {
                        name: 'PlayStation BIOS',
                        extensions: [
                            'bin',
                            'BIN'
                        ]
                    }
                ]
            }, (filenames) => {
                if (filenames) {
                    this.form.bios = filenames[0]
                }
            })
        },
        checkPreviousConfiguration () {
            return new Promise((resolve, reject) => {
                if (this.form.ignorePreviousConfiguration) {
                    return resolve()
                }

                const epsxerc = path.join(
                    app.getPath('home'),
                    '.epsxe/epsxerc'
                )
                fs.access(epsxerc, fs.constants.F_OK, (err) => {
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
                        message: 'Previous configuration for ePSXe emulator found. Do you wish to make a backup?',
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
                    title: 'Save previous ePSXe configuration',
                    defaultPath: app.getPath('documents')
                }, (filename) => {
                    if (filename) {
                        const epsxerc = path.join(
                            app.getPath('home'),
                            '.epsxe/epsxerc'
                        )
                        const writable = fs.createWriteStream(filename)
                        fs.createReadStream(epsxerc).pipe(writable)
                        writable.on('finish', () => {
                            resolve()
                        })
                        writable.on('error', (err) => {
                            reject(err)
                        })
                    } else {
                        reject('Canceled by the user')
                    }
                })
            })
        },
        checkEmulatorDirectory () {
            return new Promise((resolve, reject) => {
                const dir = path.join(
                    app.getPath('home'),
                    '.epsxe'
                )
                fs.mkdir(dir, (err) => {
                    if (err) {
                        if (err.code === 'EEXIST') {
                            return resolve()
                        }
                        return reject(err)
                    }
                    return resolve()
                })
            })
        }
    }
}
</script>

<style lang="css">
</style>
