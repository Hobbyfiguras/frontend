<template>
  <div class="container">
    <h1 class="title">Referencia de formato</h1>
    <div class="columns">
      <div class="column is-6">
        <b-input type="textarea" rows=160 v-model="markdownGuide" readonly></b-input>
      </div>
      <div class="column is-6">
        <Markdown :source="markdownGuide"></Markdown>
      </div>
    </div>
  </div>
</template>

<script>
import Markdown from '@/components/markdown'
export default {
  name: 'markdown_guide',
  components: { Markdown },
  data () {
    return {
      markdownGuide: ''
    }
  }
}
</script>

<style scoped>
</style>
