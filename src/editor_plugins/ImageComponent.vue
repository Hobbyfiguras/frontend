<template>
  <img @click="imageModal()" :src="src" class="user-image"/>
</template>

<script>
export default {
  props: ['node', 'updateAttrs'],
  computed: {
    src: {
      get() {
        return this.node.attrs['src']
      },
      set(src) {
        this.updateAttrs({
          'src': src
        })
      },
    },
  },
  methods: {
    imageModal() {
        this.$modal.open(
            `<div class="is-flex is-horizontal-center">
              <figure class="image">
                    <img class="modal-image" src="${this.src}">
              </figure>
            </div>`
        )
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
