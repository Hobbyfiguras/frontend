<template>
  <tr>
    <td>
      <figure class="image is-64x64">
        <img src="../../assets/icono-forov2.png" class="is-rounded" alt="">
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
      <div class="field has-addons" v-if="!editing">
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
      editing: false
    }
  },
  methods: {
    edit () {
      this.editing = true
      this.tempForum = JSON.parse(JSON.stringify(this.value))
    },
    cancel () {
      this.editing = false
    },
    save () {
      this.tempForum.category = this.tempForum.category.id
      this.makePetition(Forum.updateForum(this.tempForum.slug, this.tempForum)).then((category) => {
        this.$emit('input', this.tempForum)
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
    }
  }
}
</script>

<style scoped>

</style>
