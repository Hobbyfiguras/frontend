<template>
  <div class="container" v-if="message">
    <div class="columns">
      <div class="column is-1">
        <figure class="image">
          <img :src="message.creator.avatar" class="is-rounded" alt="">
        </figure>
      </div>
      <div class="column is-11">
        <p class="title">{{message.subject}}</p>
        <p class="subtitle">
          <router-link class="user-link" :to="{name: 'profile', params: {username: message.creator.username}}">
            por {{message.creator.username}}
          </router-link>
        </p>
      </div>
    </div>
    <div class="card">
      <div class="card-content">
        <Markdown :source="message.content"></Markdown>
      </div>
    </div>
    <div class="container" v-if="message.creator.username !== currentUser.username">
      <MarkdownEditor v-model="newMessage"></MarkdownEditor>
      <div class="is-divider"></div>
      <div class="level">
        <div class="level-left">
        </div>
        <div class="level-right">
          <div class="level-item">
            <button class="button is-primary" @click="sendMessage" :disabled="newMessage.trim() === ''">Enviar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import PetitionsMixin from '@/components/mixins/petitions'
import FigureSite from '@/api/figuresite'
import Markdown from '@/components/markdown'
import MarkdownEditor from '@/components/markdown_editor'

export default {
  mixins: [PetitionsMixin],
  components: { Markdown, MarkdownEditor },
  data () {
    return {
      message: null,
      newMessage: ''
    }
  },
  computed: {
    ...mapState({
      currentUser: state => state.auth.currentUser
    })
  },
  mounted () {
    this.fetchData()
  },
  props: {
    id: String
  },
  watch: {
    // call again the method if the route changes
    '$route': 'fetchData'
  },
  methods: {
    fetchData () {
      this.makePetition(FigureSite.getPrivateMessage(this.id)).then((message) => {
        this.message = message
        this.setMessageRead(message)
      })
    },
    sendMessage () {
      let subject
      if (this.message.subject.startsWith('RE:')) {
        subject = this.message.subject
      } else {
        subject = 'RE: ' + this.message.subject
      }
      this.$awn.async(this.makePetition(FigureSite.sendMessage(this.message.creator.username, subject, this.newMessage)), 'Mensaje enviado correctamente.', 'Error enviando mensaje', 'Enviando mensaje')
    },
    ...mapActions('privateMessages', ['setMessageRead'])
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
