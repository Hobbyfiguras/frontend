<template>
    <div class="modal-card" style="width: auto">
        <header class="modal-card-head">
            <p class="modal-card-title">Crear foro</p>
        </header>
        <section class="modal-card-body">
        <b-field label="Nombre">
            <b-input
                v-model="forum.name"
                placeholder="Nombre"
                required>
            </b-input>
        </b-field>
        <b-field label="Descripción">
            <b-input
                v-model="forum.description"
                placeholder="Descripción">
            </b-input>
        </b-field>
        <b-field label="Solo moderadores">
            <b-switch
                v-model="forum.only_staff_can_post">
            </b-switch>
        </b-field>
        <b-field label="Icono">
            <b-upload v-model="dropFiles" drag-drop>
                <section class="section">
                    <div class="content has-text-centered">
                        <p>
                            <b-icon
                                icon="upload"
                                size="is-large">
                            </b-icon>
                        </p>
                        <p>Suelta archivos aquí o haz clic</p>
                    </div>
                </section>
            </b-upload>
        </b-field>
        <div class="tags">
          <span v-for="(file, index) in dropFiles"
            :key="index"
            class="tag is-primary" >
            {{file.name}}
            <button class="delete is-small"
                type="button"
                @click="deleteDropFile(index)">
            </button>
          </span>
        </div>
        </section>
        <footer class="modal-card-foot">
            <button class="button" type="button" @click="$parent.close()">Close</button>
            <button class="button is-primary" @click="onCreateForum">Crear</button>
        </footer>
    </div>
</template>

<script>
import petitionsMixin from '@/components/mixins/petitions'
import Forum from '@/api/forum'
import PostItem from '@/components/forum/PostItem'

export default {
  name: 'admin_create_forum',
  mixins: [petitionsMixin],
  components: { PostItem },
  props: ['category'],
  data () {
    return {
      forum: {
        name: '',
        description: '',
        category: this.category.id,
        only_staff_can_post: false,
        icon: null
      },
      dropFiles: []
    }
  },
  methods: {
    onCreateForum () {
      console.log(this.category)
      if (this.dropFiles.length > 0) {
        this.fileToBase64(this.dropFiles[0]).then((encodedImage) => {
          this.forum.icon = encodedImage
          this.createForum()
        })
      } else {
        this.createForum()
      }
    },
    createForum () {
      this.makePetition(Forum.createForum(this.forum)).then((forum) => {
        forum.thread_count = 0
        this.$emit('createForum', forum)
        this.$parent.close()
      })
    },
    deleteDropFile (index) {
      this.dropFiles.splice(index, 1)
    }
  }
}
</script>

<style scoped>

</style>
