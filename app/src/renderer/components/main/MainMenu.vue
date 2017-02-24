<template lang="html">
    <div>
        <nav class="nav has-shadow is-inverted">
            <div class="container">
                <div class="nav-left">
                    <a href="#" class="nav-item">
                        <img src="./assets/logo.png" alt="RP">
                    </a>
                    <a href="#"
                        class="nav-item is-tab"
                        :class="{ 'is-active': nav.isActive }"
                        @click="selectContent(index)"
                        v-for="(nav, index) in navs">
                        {{nav.label}}
                    </a>
                </div>
            </div>
        </nav>
        <div>
            <slot></slot>
        </div>
    </div>
</template>

<script>
export default {
    name: 'main-menu',
    data () {
        return {
            navs: []
        }
    },
    mounted () {
        this.navs = this.$children
    },
    methods: {
        selectContent (selectedNav) {
            this.navs.forEach((nav, index) => {
                nav.isActive = (index === selectedNav)
            })
        }
    }
}
</script>

<style lang="css">
.nav-item img {
    max-height: 2.75rem;
}

.is-inverted {
    background-color: #2c3e50;
}

a.nav-item.is-tab {
    font-weight: bold;
    color: #fdfdfd;
}
</style>
