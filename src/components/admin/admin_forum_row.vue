<template>
  <tr v-if="!editing">
    <td>
      <figure class="image is-64x64">
        <img :src="value.icon" class="is-rounded" alt="">
      </figure>
    </td>
    <td>{{ value.name }}</td>
    <td>{{ value.description }}</td>
    <td>{{ value.thread_count }}</td>
    <td>
      <b-icon v-if="value.only_staff_can_post" icon="check"></b-icon>
      <b-icon v-else icon="cancel"></b-icon>
    </td>
    <td>
      <div class="field has-addons">
        <p class="control">
          <button class="button" @click="edit">
            <b-icon icon="pencil"></b-icon>
          </button>
        </p>
        <p class="control">
          <button class="button is-danger" @click="deleteForum">
            <b-icon icon="delete"></b-icon>
          </button>
        </p>
        <p class="control">
          <button class="button" @click="$emit('forumUp', value)">
            <b-icon icon="arrow-up"></b-icon>
          </button>
        </p>
        <p class="control">
          <button class="button" @click="$emit('forumDown', value)">
            <b-icon icon="arrow-down"></b-icon>
          </button>
        </p>
      </div>
    </td>
  </tr>
  <tr v-else>
    <td>
      <b-field>
        <b-upload v-model="newIcon" drag-drop>
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
        <span v-for="(file, index) in newIcon"
          :key="index"
          class="tag is-primary" >
          {{file.name}}
          <button class="delete is-small"
              type="button"
              @click="deleteDropFile(index)">
          </button>
        </span>
      </div>
    </td>
    <td><b-input v-model="tempForum.name"></b-input></td>
    <td><b-input v-model="tempForum.description" type="textarea"></b-input></td>
    <td>{{ value.thread_count }}</td>
    <td>
      <b-checkbox v-model="tempForum.only_staff_can_post"></b-checkbox>
    </td>
    <td>
      <div class="field has-addons" v-if="editing">
        <p class="control">
          <button class="button is-success" @click="save">
            <b-icon icon="check"></b-icon>
          </button>
        </p>
        <p class="control">
          <button class="button is-danger" @click="cancel">
            <b-icon icon="close"></b-icon>
          </button>
        </p>
        <p class="control">
          <button class="button" @click="$emit('forumUp', value)">
            <b-icon icon="arrow-up"></b-icon>
          </button>
        </p>
        <p class="control">
          <button class="button" @click="$emit('forumDown', value)">
            <b-icon icon="arrow-down"></b-icon>
          </button>
        </p>
      </div>
    </td>
  </tr>
</template>

<script>
import petitionsMixin from '@/components/mixins/petitions'
import Forum from '@/api/forum'
export default {
  name: 'admin_forum',
  mixins: [petitionsMixin],
  props: ['value'],
  data () {
    return {
      tempForum: {},
      editing: false,
      newIcon: null
    }
  },
  methods: {
    edit () {
      this.editing = true
      this.tempForum = JSON.parse(JSON.stringify(this.value))
      this.newIcon = []
    },
    cancel () {
      this.editing = false
    },
    save () {
      if (this.newIcon.length > 0) {
        this.fileToBase64(this.newIcon[0]).then((encodedImage) => {
          this.tempForum.icon = encodedImage
          this.updateForum()
        })
      } else {
        delete this.tempForum.icon
        this.updateForum()
      }
    },
    updateForum () {
      this.makePetition(Forum.updateForum(this.tempForum.slug, this.tempForum)).then((forum) => {
        this.$emit('updateForum', forum)
        this.editing = false
      })
    },
    deleteForum () {
      this.$dialog.confirm({
        title: 'Eliminar categoria',
        message: 'Estas seguro de querer eliminar este foro?',
        confirmText: 'Si',
        cancelText: 'No, volver atrás',
        type: 'is-danger',
        hasIcon: true,
        onConfirm: () => {
          this.makePetition(Forum.deleteForum(this.value.slug)).then((category) => {
            this.$emit('deleteForum', this.value)
          })
        }
      })
    },
    deleteDropFile (index) {
      this.newIcon.splice(index, 1)
    }
  }
}
</script>

<style scoped>

</style>
