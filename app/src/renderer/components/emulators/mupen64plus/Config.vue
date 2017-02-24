<template lang="html">
    <div class="modal" :class="{ 'is-active': isActive }">
        <div class="modal-background"></div>
        <div class="modal-card">
            <header class="modal-card-head">
                <p class="modal-card-title">Config Mupen64Plus</p>
                <button class="delete" @click="$emit('close')"></button>
            </header>
            <section class="modal-card-body">
                <label class="label">Path to Mupen64Plus</label>
                <p class="control">
                    <input type="text" class="input">
                </p>

                <label class="label">Display Mode</label>
                <p class="control">
                    <label class="radio">
                        <input type="radio" checked="checked">
                        Fullscreen Mode
                    </label>
                    <label class="radio">
                        <input type="radio">
                        Windowed Mode
                    </label>
                </p>

                <label class="label">Resolution</label>
                <p class="control">
                    <span class="select">
                        <select>
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
                },
                {
                    value: 'custom',
                    text: 'Custom'
                }
            ]
        }
    },
    methods: {
        save () {
            // save to preferences
            this.$emit('close')
        }
    }
}
</script>

<style lang="css">
</style>
