<template>
  <div>
    <MarkdownEditor ref="editor" v-model="post.content"></MarkdownEditor>
    <div class="is-divider"></div>
    <div class="level">
      <div class="level-left">
      </div>
      <div class="level-right">
        <div class="level-item">
          <button class="button is-primary" :disabled="post.content.trim() === ''" @click="createPost">Enviar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MarkdownEditor from '@/components/markdown_editor'
import PetitionsMixin from '@/components/mixins/petitions'
import Forum from '@/api/forum'
import { mapState } from 'vuex'

export default {
  components: { MarkdownEditor },
  mixins: [PetitionsMixin],
  props: ['thread'],
  data () {
    return {
      post: {
        content: ''
      }
    }
  },
  computed: {
    ...mapState({
      currentUser: state => state.auth.currentUser
    })
  },
  methods: {
    createPost () {
      this.$awn.async(this.makePetition(Forum.createPost(this.thread, this.post.content)).then((post) => {
        this.post.creator = this.currentUser
        this.post.created = Date.now()
        this.post.id = post.id
        this.$emit('createPost', this.post)
        this.post = {
          content: ''
        }
      }), 'Mensaje publicado correctamente.', 'Error creando post', 'Creando post')
    },
    addText (text) {
      this.$refs.editor.insertText(text + '\n')
      console.log(text + '\n' + this.post.content)
    }
  }
}
</script>

<style scoped>

</style>
