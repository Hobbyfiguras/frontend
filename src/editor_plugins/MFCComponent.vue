<template>
  <a :href="`https://myfigurecollection.net/item/${mfcId}`">
    <img class="mfc-thumbnail" :src="`https://static.myfigurecollection.net/pics/figure/${mfcId}.jpg`">
  </a>
</template>

<script>
export default {
  props: ['node', 'updateAttrs', 'view'],
  computed: {
    mfcId: {
      get() {
        return this.node.attrs['data-mfc-id']
      },
      set(mfcId) {
        this.updateAttrs({
          'data-mfc-id': mfcId
        })
      },
    },
  }
}
</script>

<style scoped>

</style>
