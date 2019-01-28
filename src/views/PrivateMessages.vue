<template>
<div>
  <div class="container">
    <p class="title">Mensajes privados</p>
    <div class="card" v-for="message in messages.results" :key="message.id">
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
        </div>
      </article>
    </div>
    <div>

  </div>
  <div class="container">
    <b-pagination
    :total="messages.count"
    @change="changePage"
    :current="currentPage"
    :per-page="itemsPerPage"
    order="is-centered"/>
    </div>
  </div>
</div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import FigureSite from '@/api/figuresite'
export default {
  data () {
    return {
      currentPage: 1,
      messages: {},
      itemsPerPage: 20
    }
  },
  created () {
    this.changePage(1)
  },
  computed: {
    ...mapState({
      stateMessages: state => state.privateMessages.messages,
      stateUnreadMessageCount: state => state.privateMessages.unreadMessageCount
    })
  },
  methods: {
    ...mapActions('notifications', ['setNotificationRead']),
    changePage (pageN) {
      return FigureSite.getPrivateMessages(pageN).then((response) => {
        this.messages = response
        this.currentPage = pageN
      })
    }
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
