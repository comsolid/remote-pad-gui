<template lang="html">
    <div class="card">
        <header class="card-header">
            <p class="card-header-title">
                {{description}}
                <span class="tag is-success is-pulled-right">Connected</span>
            </p>

        </header>
        <footer class="card-footer">
            <a href="#" class="card-footer-item is-disabled">Start</a>
            <a href="#" class="card-footer-item">Restart</a>
            <a href="#" class="card-footer-item">Stop</a>
        </footer>
    </div>
</template>

<script>
export default {
    name: 'service-card',
    props: {
        description: {
            type: String,
            required: true
        }
    }
}
</script>

<style lang="css" scoped>
.card-header-title {
    justify-content: space-between;
}
</style>
