<template>
    <div>
    <div class="container" v-if="post">
        <PostItem :post="post"></PostItem>
    </div>
    <div class="container" v-if="post">
        <div class="level">
            <div class="level-left">
                <div class="level-item">
                    <b-field>
                        <router-link :to="getPostLinkData(post, post.thread)" class="button is-primary">Ver en el tema</router-link>
                    </b-field>
                </div>
            </div>
            <div class="level-right"></div>
        </div>

    </div>
    </div>

</template>

<script>
import Forum from '@/api/forum'
import PetitionsMixin from '@/components/mixins/petitions'
import PostItem from '@/components/forum/PostItem'
import NSFWWarningMixin from '@/components/mixins/NSFWWarningMixin'
import PostCreate from '@/views/forum/post_create'
import { mapGetters, mapState } from 'vuex'

export default {
  name: 'PostView',
  mixins: [PetitionsMixin, NSFWWarningMixin],
  components: { PostItem, PostCreate },
  data () {
    return {
      post: null
    }
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
  computed: {
    ...mapGetters('settings', ['isNSFWEnabled']),
    ...mapState({
      currentUser: state => state.auth.currentUser
    })
  },
  methods: {
    fetchData () {
      this.makePetition(Forum.getPost(this.id)).then((post) => {
        this.post = post
        if (this.post.thread.nsfw && !this.isNSFWEnabled) {
          this.askNSFW()
        }
      })
    }
  }
}

</script>

<style lang="scss" scoped>
</style>
