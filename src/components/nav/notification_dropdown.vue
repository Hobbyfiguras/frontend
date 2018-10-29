<template>
<b-dropdown>
  <slot name="trigger" slot="trigger">
  </slot>
  <b-dropdown-item v-for="notification in unreadNotifications.slice(0, 4)" :key="notification.id">
    <article class="media">
      <figure class="media-left">
        <p class="image is-64x64">
          <img  class="is-rounded" :src="notification.actor.avatar">
        </p>
      </figure>
      <div class="media-content">
        <router-link :to="getNotificationLink(notification)">
          <div class="content is-text">
            {{ notification.actor.username }} ha comentado en {{notification.notification_object.thread.title}}
            <p v-if="notification.notification_type === 'notification_post_sub'">
            </p>
          </div>
        </router-link>
        <nav class="level is-mobile">
          <div class="level-left">
            <a class="level-item">
              <span class="icon is-small"><i class="fas fa-reply"></i></span>
            </a>
            <a class="level-item">
              <span class="icon is-small"><i class="fas fa-retweet"></i></span>
            </a>
            <a class="level-item">
              <span class="icon is-small"><i class="fas fa-heart"></i></span>
            </a>
          </div>
        </nav>
      </div>
      <div class="media-right">
        <button class="delete" @click="setNotificationRead(JSON.parse(JSON.stringify(notification)))"></button>
      </div>
    </article>
  </b-dropdown-item>
  <b-dropdown-item class="has-text-centered" has-link>
    <router-link :to="{name: 'index'}">Leer más</router-link>
  </b-dropdown-item>
</b-dropdown>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  computed: {
    ...mapState({
      unreadNotifications: state => state.notifications.unreadNotifications,
      unreadNotificationCount: state => state.notifications.unreadNotificationCount
    })
  },
  methods: {
    ...mapActions('notifications', ['setNotificationRead']),
    getNotificationLink (notification) {
      if (notification.notification_type === 'notification_post_sub') {
        return {
          name: 'thread',
          hash: '#' + notification.notification_object.id,
          params: {
            id: notification.notification_object.thread.id,
            slug: notification.notification_object.thread.slug,
            forum: notification.notification_object.thread.forum.slug,
            page: notification.notification_object.page
          }
        }
      }
    }
  }
}
</script>

<style scoped>

.dropdown-content {
  padding-bottom: 0;
}

.dropdown-menu {
  min-width: 25rem !important;
}
.dropdown-item {
    padding-right: 1.0rem;

}

a {
  color: inherit;
}
</style>
