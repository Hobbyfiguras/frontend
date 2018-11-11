<template>
  <div class="container">
    <p class="title">Mensajes privados</p>
    <div class="card" v-for="message in messages" :key="message.id">
      <article class="card-content media" >
        <figure class="media-left">
          <p class="image is-64x64">
            <img  class="is-rounded" :src="message.creator.avatar">
          </p>
        </figure>
        <div class="media-content">
          <router-link :to="{name: 'PrivateMessage', params: { id: message.id }}">
            <div class="content is-text">
              {{ message.subject }}
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
    </div>

  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  computed: {
    ...mapState({
      messages: state => state.privateMessages.messages,
      unreadMessageCount: state => state.privateMessages.unreadMessageCount
    })
  },
  methods: {
    ...mapActions('notifications', ['setNotificationRead'])
  }
}
</script>

<style scoped>

.media {
  background-color: $white;
}
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
