<template>
  <div class="quote" v-if="username && id">
    <div class="quote-top">
      <router-link :to="{name: 'PostView', params: {id: this.id}}">Cita de {{username}}</router-link>
    </div>
    <editor-content class="quote-content content" :editor="editor" />
  </div>
</template>

<script>
import { createEditor } from '@/components/Editor'
import { EditorContent } from 'tiptap'
export default {
  props: ['updateAttrs', 'node'],
  components: {
    EditorContent
  },
  data () {
    return {
      editor: createEditor({ editable: false })
    }
  },
  mounted () {
    console.log('setting content', this.content)
    var content
    try {
      content = JSON.parse(this.content)
    } catch (error) {
      content = this.content
    }
    this.editor.setContent(content)
  },
  computed: {
    username: {
      get() {
        return this.node.attrs['data-username']
      },
      set(username) {
        this.updateAttrs({
          'data-username': username
        })
      },
    },
    id: {
      get() {
        return this.node.attrs['data-id']
      },
      set(id) {
        this.updateAttrs({
          'data-id': id
        })
        this.editor.content
      },
    },
    content: {
      get() {
        console.log('get content', this.node.attrs['data-content'])
        return this.node.attrs['data-content']
      },
      set(content) {
        this.updateAttrs({
          'data-content': content
        })
        this.editor.setContent(content)
      },
    },
  }
}
</script>

<style scoped lang="scss">
.quote-top {
  background-color: #4827A2;
  padding-left: 1.5rem;
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
  color: white !important;
  a {
    color: white !important;
  }
}

.quote {
  box-shadow: 0 2px 3px rgba(10, 10, 10, 0.1), 0 0 0 1px rgba(10, 10, 10, 0.1);
  margin-bottom: 0.5rem;
}
.quote-content {
  padding-left: 1.5rem;
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
}

.coontent {
  margin-left: 0;
}
</style>
