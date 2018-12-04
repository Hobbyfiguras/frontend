<template>
<div class="modal-card" style="width: auto">
  <header class="modal-card-head">
    <p class="modal-card-title">Mover hilo</p>
  </header>
  <section class="modal-card-body">
    <b-field label="Nuevo foro">
      <b-select
        v-model="newForum"
        required>
        <optgroup v-if="categories" v-for="category in categories" :key="category.id" :label="category.name">
          <option v-for="forum in category.forums" :key="forum.id" :value="forum.id">{{forum.name}}</option>
        </optgroup>
      </b-select>
    </b-field>
  </section>
  <footer class="modal-card-foot">
    <button class="button" type="button" @click="$parent.close()">Cerrar</button>
    <button class="button is-primary" @click="moveThread">Enviar</button>
  </footer>
</div>
</template>

<script>
import petitionsMixin from '@/components/mixins/petitions'
import Forum from '@/api/forum'

export default {
  mixins: [petitionsMixin],
  props: ['thread'],
  data () {
    return {
      newForum: this.thread.forum.id,
      categories: {}
    }
  },
  created () {
    this.makePetition(Forum.getForumCategories()).then((categories) => {
      this.categories = categories
    })
  },
  methods: {
    moveThread () {
      this.categories.forEach(category => {
        category.forums.forEach((forum) => {
          if (forum.id === this.newForum) {
            let threadData = JSON.parse(JSON.stringify(this.thread))
            threadData.forum = forum
            this.$parent.close()
            this.$awn.async(this.makePetition(Forum.moveThread(this.thread.id, this.newForum)), 'Hilo movido.', 'Error moviendo hilo', 'Moviendo hilo')
            this.$router.push(this.getThreadLinkData(threadData), () => {
              this.$router.go()
            })
          }
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
