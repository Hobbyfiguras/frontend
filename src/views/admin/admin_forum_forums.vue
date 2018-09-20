<template>
  <div>
    <div v-for="category in categories" :key="category.id" class="has-text-centered is-centered" v-if="categories">
      <p>
        {{ category.name }}
      </p>
      <table class="table is-fullwidth">
        <thead>
          <tr>
            <th>Icono</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Nº Temas</th>
            <th>Solo moderadores</th>
            <th>
              <button class="button is-primary" @click="createForum(category)">
                <b-icon icon="plus"></b-icon>
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          <AdminForumRow v-for="(forum, index) in orderedForums(category.forums)" :key="forum.id" @deleteForum="deleteForum" @forumUp="forumUp" @forumDown="forumDown" v-model="orderedForums(category.forums)[index]">
          </AdminForumRow>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import petitionsMixin from '@/components/mixins/petitions'
import Forum from '@/api/forum'
import CreateForum from '@/views/admin/modals/create_forum'
import AdminForumRow from '@/components/admin/admin_forum_row'
export default {
  name: 'admin_forum_categories',
  mixins: [petitionsMixin],
  components: { AdminForumRow },
  data () {
    return {
      categories: []
    }
  },
  methods: {
    fetchData () {
      this.makePetition(Forum.getForumCategories()).then((categories) => {
        this.categories = categories
      })
    },
    onForumCreated (forum) {
      // this.categories.push(category)
      var cat = this.categories.findIndex((category) => category.id === forum.category)
      this.categories[cat].forums.push(forum)
    },
    deleteForum (forum) {
      this.categories.forEach((category, index) => {
        let idx = category.forums.findIndex((foundForum) => foundForum.id === forum.id)
        if (idx !== -1) {
          this.categories[index].forums.splice(idx, 1)
        }
      })
    },
    forumUp (forum) {
      this.categories.forEach((category, index) => {
        if (forum.order !== 0) {
          let topForumIDX = category.forums.findIndex((foundForum) => foundForum.order === forum.order - 1)
          let forumIDX = category.forums.findIndex((foundForum) => foundForum.id === forum.id)
          if (forumIDX !== -1 && topForumIDX !== -1) {
            this.categories[index].forums[forumIDX].order--
            this.categories[index].forums[topForumIDX].order++
            this.makePetition(Forum.moveForumUp(forum.slug))
          }
        }
      })
    },
    forumDown (forum) {
      this.categories.forEach((category, index) => {
        if (forum.order !== category.forums.length - 1) {
          let bottomForumIDX = category.forums.findIndex((foundForum) => foundForum.order === forum.order + 1)
          let forumIDX = category.forums.findIndex((foundForum) => foundForum.id === forum.id)
          if (forumIDX !== -1 && bottomForumIDX !== -1) {
            this.categories[index].forums[forumIDX].order++
            this.categories[index].forums[bottomForumIDX].order--
            this.makePetition(Forum.moveForumDown(forum.slug))
          }
        }
      })
    },
    createForum (category) {
      this.$modal.open({
        parent: this,
        component: CreateForum,
        hasModalCard: true,
        props: { category: category },
        events: {
          'createForum': this.onForumCreated
        }
      })
    },
    orderedForums (forums) {
      var tempForum = JSON.parse(JSON.stringify(forums))
      return tempForum.sort((a, b) => {
        return a.order > b.order
      })
    }
  },
  mounted () {
    this.fetchData()
  }
}
</script>

<style scoped>

</style>
