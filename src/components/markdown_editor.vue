<template>
  <div>
    <div class="level">
      <div class="level-left">
        <b-tooltip label="Previsualizar">
          <button class="button" @click="previewing = !previewing" :class="{'is-active': previewing}">
            <b-icon icon="eye"></b-icon>
          </button>
        </b-tooltip>
        <div class="is-divider-vertical"></div>
        <b-tooltip label="Negrita">
          <button class="button" @click="previewing = !previewing" :class="{'is-active': previewing}">
            <b-icon icon="format-bold"></b-icon>
          </button>
        </b-tooltip>
        <b-tooltip label="Cursiva">
          <button class="button" @click="previewing = !previewing" :class="{'is-active': previewing}">
            <b-icon icon="format-italic"></b-icon>
          </button>

        </b-tooltip>
        <b-tooltip label="Tachado">
          <button class="button" @click="previewing = !previewing" :class="{'is-active': previewing}">
            <b-icon icon="format-strikethrough"></b-icon>
          </button>
        </b-tooltip>
      </div>
      <div class="level-right">
        <div class="level-item">

        </div>
      </div>
    </div>
    <markdown v-if="previewing" :source="value"></markdown>
    <b-input v-else :value="value" v-on:input="updateInput" maxlength="20000" type="textarea"></b-input>
  </div>
</template>

<script>
import markdown from '@/components/markdown'
export default {
  name: 'markdown_editor',
  props: ['value'],
  components: { markdown },
  data () {
    return {
      previewing: false,
      content: ''
    }
  },
  methods: {
    updateInput (val) {
      this.$emit('input', val)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
