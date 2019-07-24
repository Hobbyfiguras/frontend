<template>
  <span>{{emoji}}</span>
</template>

<script>
import twemoji from 'twemoji'
export default {
  props: ['node', 'updateAttrs'],
  mounted() {
    twemoji.parse(this.$el)
  },
  computed: {
    emoji: {
      get() {
        return this.node.attrs['data-emoji']
      },
      set(emoji) {
        this.updateAttrs({
          'data-emoji': emoji
        })
        
      },
    },
  }
}
</script>
<style>
  .modal-image {
    width: auto !important;
    height: 100% !important;
  }
  .is-horizontal-center {
    justify-content: center;
  }
</style>
