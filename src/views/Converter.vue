<template>
  <div class="container">
    <div class="columns">
      <div class="column">
        <b-input type="textarea" @input="onInput"></b-input>
      </div>
      <div class="column">
        <b-input type="textarea" v-model="intermediateHTML"></b-input>
      </div>
      <div class="column">
        <b-input type="textarea" v-model="output"></b-input>
      </div>
    </div>
    <div class="columns">
      <div class="column content">
        <vue-markdown :source="source" ref="md"></vue-markdown>
      </div>
    </div>
  </div>
</template>

<script>
import VueMarkdown from 'vue-markdown'
import cheerio from 'cheerio'
import { createEditor } from '@/components/Editor'

const editor = createEditor()

function escapeHtml(unsafe) {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
 }

function html2prosemirrorJSON (root) {
    // Convert user quotes
    root('UserQuote').each(function () {
        const element = root(this)
        var json = html2prosemirrorJSON(cheerio.load(element('body').html(), {
            xmlMode: false,
            decodeEntities: false
        }))
        console.log(json)
        var dataContent = escapeHtml(JSON.stringify(json))
        var newNode = `<span data-content="${dataContent}" data-username="${element.attr('username')}" data-id="${element.attr('id')}">asd</span>`
        element.replaceWith(newNode)
    })

    // Convert MFC images
    root('.mfc-thumbnail').each(function () {
      const element = root(this)
      console.log(element)
      var mfcID = element.attr('src').replace('https://static.myfigurecollection.net/pics/figure/', '').replace('.jpg', '')
      console.log(mfcID)
      var newElement = `<span data-mfc-id="${mfcID}">asd</span>`
      console.log(newElement)
      element.parent().replaceWith(newElement)
    })

    root('img').each(function () {
      const element = root(this)
      if (element.attr('alt')) {
        element.replaceWith(element.attr('alt'))
      }
    })



    editor.setContent(root('body').html())
    
    return editor.getJSON()
}

export default {
  
  data () {
    return {
      output: '',
      intermediateHTML: '',
      source: ''
    }
  },
  methods: {
    onInput(value) {
      this.hfMD2html(value)
    },
    hfMD2html (data) {
        VueMarkdown.VueMarkdownComponent.postrender = function () {}
        VueMarkdown.VueMarkdownComponent.$emit = function () {}
        VueMarkdown.VueMarkdownComponent.render(() => true)
        const markdownIt = VueMarkdown.VueMarkdownComponent.md

        this.source = data
        this.$nextTick().then(() => {
          this.intermediateHTML = this.$refs.md.$el.innerHTML
          console.log(this.$refs.md.$el.innerHTML)
          var code = this.$refs.md.$el.innerHTML.replace('<br>', '<br/>')
          var html = cheerio.load(code, {
              decodeEntities: false
          })
          this.intermediateHTML = this.$refs.md.$el.innerHTML
          console.log('final__HTML',html('body').html())
          this.output = JSON.stringify(html2prosemirrorJSON(html))
        })
    }
  }
}
</script>