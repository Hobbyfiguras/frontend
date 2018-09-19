<template>
    <div class="container">
        <div class="tabs is-centered">
            <ul>
                <li :class="{ 'is-active': $route.name === 'admin' }">
                    <router-link :to="{name: 'admin'}">
                        <b-icon icon="home"></b-icon>
                        <span></span>
                    </router-link>
                </li>
                <li :class="{ 'is-active': $route.name === 'admin_reports' }">
                    <router-link :to="{name: 'admin_reports'}">
                        <b-icon icon="flag"></b-icon>
                        <span>Reportes</span>
                    </router-link>
                </li>
                <li :class="{ 'is-active': $route.name === 'admin_forum_categories' }">
                    <router-link :to="{name: 'admin_forum_categories'}">
                        <b-icon icon="shape"></b-icon>
                        <span>Categorias</span>
                    </router-link>
                </li>
                <li :class="{ 'is-active': $route.name === 'admin_forum_forums' }">
                    <router-link :to="{name: 'admin_forum_forums'}">
                        <b-icon icon="forum"></b-icon>
                        <span>Foros</span>
                    </router-link>
                </li>
            </ul>
        </div>
        <router-view></router-view>
    </div>
</template>

<script>
export default {
  name: 'admin_base'
}
</script>

<style scoped>

</style>
