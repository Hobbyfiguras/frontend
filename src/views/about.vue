<template>
  <div class="container">
    <bulma-accordion>
      <bulma-accordion-item v-for="question in questions" :key="question.id" :ref="'#' + question.short_name">
          <h4 slot="title"><router-link :to="{name: 'about', hash: '#' + question.short_name}">{{question.title}}</router-link></h4>
          <div v-html="question.content" class="content" slot="content"></div>
      </bulma-accordion-item>
    </bulma-accordion>
  </div>
</template>

<script>
import PetitionsMixin from '@/components/mixins/petitions'
import NekoNet from '@/api/nekonet'

export default {
  name: 'about',
  created () {
    this.fetchData()
  },
  watch: {
    // call again the method if the route changes
    '$route': 'fetchData'
  },
  mounted () {

  },
  data () {
    return {
      questions: []
    }
  },
  methods: {
    fetchData () {
      this.makePetition(NekoNet.getQuestions()).then((questions) => {
        this.questions = questions
        this.$nextTick(() => {
          this.scrollToHash()
        })
      })
    },
    scrollToHash () {
      if (this.$refs[this.$route.hash]) {
        var ref = this.$refs[this.$route.hash][0]
        if (ref) {
          console.log(ref)
          this.$SmoothScroll(ref.$el, 1000)
          ref.isOpen = true
        }
      }
    }
  },
  mixins: [PetitionsMixin]
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">

</style>
