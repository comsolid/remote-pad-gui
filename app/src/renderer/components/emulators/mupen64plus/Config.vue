<template lang="html">
    <div class="modal" :class="{ 'is-active': isActive }">
        <div class="modal-background"></div>
        <div class="modal-card">
            <header class="modal-card-head">
                <p class="modal-card-title">Config Mupen64Plus</p>
                <button class="delete" @click="$emit('close')"></button>
            </header>
            <section class="modal-card-body">
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
            </section>
            <footer class="modal-card-foot">
                <a class="button is-success is-large"
                    @click.prevent="save">Save changes</a>
            </footer>
        </div>
    </div>
</template>

<script>
import settings from 'electron-settings'
import { remote } from 'electron'
const dialog = remote.dialog

export default {
    name: 'mupen64plus-config',
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
                    text: '640x480'
                },
                {
                    value: '800x600',
                    text: '800x600'
                },
                {
                    value: '1024x768',
                    text: '1024x768'
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
