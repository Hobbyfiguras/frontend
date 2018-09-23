<template>
    <div class="modal-card" style="width: auto">
        <header class="modal-card-head">
            <p class="modal-card-title">Crear categoria</p>
        </header>
        <section class="modal-card-body">
        <b-field label="Nombre">
            <b-input
                v-model="category.name"
                placeholder="Nombre"
                required>
            </b-input>
        </b-field>
        <b-field label="Descripción">
            <b-input
                v-model="category.description"
                placeholder="Descripción"
                required>
            </b-input>
        </b-field>
        </section>
        <footer class="modal-card-foot">
            <button class="button" type="button" @click="$parent.close()">Close</button>
            <button class="button is-primary" @click="createCategory">Crear</button>
        </footer>
    </div>
</template>

<script>
import petitionsMixin from '@/components/mixins/petitions'
import Forum from '@/api/forum'
import PostItem from '@/components/forum/PostItem'
export default {
  name: 'admin_forum_categories',
  mixins: [petitionsMixin],
  components: { PostItem },
  data () {
    return {
      category: {
        name: '',
        description: ''
      }
    }
  },
  methods: {
    createCategory () {
      this.makePetition(Forum.createForumCategory(this.category)).then((category) => {
        this.$emit('createCategory', category)
        this.$parent.close()
      })
    }
  }
}
</script>

<style scoped>

</style>
