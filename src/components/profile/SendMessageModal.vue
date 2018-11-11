<template>
<div class="modal-card" style="width: auto">
  <header class="modal-card-head">
    <p class="modal-card-title">Enviar mensaje</p>
  </header>
  <section class="modal-card-body">
    <b-field label="Asunto">
      <b-input
        v-model="subject"
        placeholder="Asunto"
        required>
      </b-input>
    </b-field>

    <b-field label="Mensaje">
      <MarkdownEditor v-model="content"></MarkdownEditor>
    </b-field>
  </section>
  <footer class="modal-card-foot">
    <button class="button" type="button" @click="$parent.close()">Cerrar</button>
    <button class="button is-primary" @click="sendMessage" :disabled="subject.trim() == '' && content.trim() == ''">Enviar</button>
  </footer>
</div>
</template>

<script>
import MarkdownEditor from '@/components/markdown_editor'
import petitionsMixin from '@/components/mixins/petitions'
import FigureSite from '@/api/figuresite'
import { mapState } from 'vuex'

export default {
  components: { MarkdownEditor },
  mixins: [petitionsMixin],
  props: ['receiver'],
  data () {
    return {
      subject: '',
      content: ''
    }
  },
  methods: {
    sendMessage () {
      console.log('sub', this.subject)
      this.$awn.async(this.makePetition(FigureSite.sendMessage(this.receiver, this.subject, this.content)), 'Mensaje enviado correctamente.', 'Error enviando mensaje', 'Enviando mensaje')
      this.$parent.close()
    }
  },
  computed: {
    ...mapState({
      currentUser: state => state.auth.currentUser
    })
  }
}
</script>

<style scoped>

</style>
