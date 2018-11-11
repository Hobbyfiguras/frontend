<template>
<b-dropdown>
  <slot name="trigger" slot="trigger">
  </slot>
  <b-dropdown-item v-for="message in messages.slice(0, 4)" :key="message.id">
    <article class="media">
      <figure class="media-left">
        <p class="image is-64x64">
          <img  class="is-rounded" :src="message.creator.avatar">
        </p>
      </figure>
      <div class="media-content">
        <router-link :to="{name: 'PrivateMessage', params: { id: message.id }}">
          <div class="content is-text">
            {{message.subject}}
            <p>Enviado por {{message.creator.username}} {{message.created | timeDiff("from")}}</p>
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
    </article>
  </b-dropdown-item>
  <b-dropdown-item class="has-text-centered" has-link>
    <router-link :to="{name: 'PrivateMessages'}">Ver todos</router-link>
  </b-dropdown-item>
</b-dropdown>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  computed: {
    ...mapState({
      messages: state => state.privateMessages.messages,
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
