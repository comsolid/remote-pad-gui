<template>
    <div id="#app">
        <router-view></router-view>
    </div>
</template>

<script>
import store from 'renderer/vuex/store'
export default {
    store
}
</script>

<style lang="css">
section.section {
    background-color: #fcfcfc;
}
</style>
