<template>
  <div>
    <editor-content class="rendered-content content" :editor="editor" />
  </div>
</template>

<script>
import { EditorContent } from 'tiptap'

import { createEditor } from '@/components/Editor'

export default {
  props: ['value'],
  components: {
    EditorContent
  },
  watch: { 
    value: {
      immediate: true,
      handler (newVal, oldVal) {
        this.editor.setContent(JSON.parse(newVal))
      }
    }
  },
  data () {
    return {
      editor: createEditor({
          editable: false,
          injectCSS: false
        })
    }
  }
}
</script>
