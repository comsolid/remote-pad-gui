<template lang="html">
    <div v-show="isActive">
        <slot></slot>
    </div>
</template>

<script>
export default {
    name: 'main-content',
    props: {
        label: {
            type: String,
            required: true
        },
        selected: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            isActive: false
        }
    },
    mounted () {
        this.isActive = this.selected
    }
}
</script>

<style lang="css">
</style>
