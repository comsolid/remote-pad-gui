<template lang="html">
    <div class="modal" :class="{ 'is-active': isActive }">
        <div class="modal-background"></div>
        <div class="modal-card">
            <header class="modal-card-head">
                <p class="modal-card-title" v-once>Config {{name}}</p>
                <button class="delete" @click="$emit('close')"></button>
            </header>
            <section class="modal-card-body">
                <slot name="form"></slot>
            </section>
            <footer class="modal-card-foot">
                <a class="button is-success is-large"
                    @click.prevent="$emit('onSave')">
                    Save changes
                </a>
            </footer>
        </div>
    </div>
</template>

<script>
// abstract emulator config modal
export default {
    name: 'emulator-config-modal',
    props: {
        isActive: {
            type: Boolean,
            required: true,
            default: false
        },
        name: {
            type: String,
            required: true
        }
    }
}
</script>

<style lang="css">
</style>
