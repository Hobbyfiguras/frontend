<template>
    <div class="vue-bulma-text-editor" v-cloak>
        <div class="editor-nav-bar">
            <div v-for="(group, i1) in toolbar" :key="i1" class="group">
                <div class="field has-addons">
                    <p v-for="(action, i2) in group" :key="i2" class="control">
                        <a class="button" @click="doAction(actions[action])" :title="actions[action].name">
                            <span class="icon is-small">
                                <b-icon :icon="actions[action].icon"></b-icon>
                            </span>
                        </a>
                    </p>
                </div>
            </div>

        </div>
        <hr>
        <div class="columns is-gapless">
            <div class="column is-half editor-field">
                <textarea class="scrollable" :style="'height:' + height + 'px'" ref="textarea" v-model="content_markdown" rows="7" spellcheck="false" autofocus></textarea>
                <span v-if="showMarkdownCounter" :class="counterClass('md')">
                    {{ content_markdown.length }} {{ markdownLimit > 0 ? ' / ' + markdownLimit : ''}}
                </span>
            </div>
            <div class="column is-half editor-field editor-preview">
              <div class="content">
                <Markdown :source="content_markdown"></Markdown>
              </div>
            </div>
        </div>

        <input type="hidden" :value="content_markdown" :name="field + '_markdown'">
    </div>
</template>

<script>
import Markdown from '@/components/markdown'

export default {
  components: { Markdown },
  props: {
    value: {
      type: String,
      default: ''
    },
    height: {
      type: String,
      default: '500'
    },
    field: {
      type: String,
      default: 'content'
    },
    markdownLimit: {
      type: Number,
      default: 0
    },
    showMarkdownCounter: {
      type: Boolean,
      default: true
    },
    htmlLimit: {
      type: Number,
      default: 0
    },
    showHtmlCounter: {
      type: Boolean,
      default: true
    },
    toolbar: {
      type: Array,
      default: () => [
        ['bold', 'italic', 'underline', 'strikethrough', 'mark'],
        ['header'],
        ['ol', 'ul'],
        ['superscript', 'subscript'],
        ['image', 'link', 'video_youtube', 'mfc'],
        ['code', 'hr', 'table', 'quote']
      ],
      validator: value => {
        let toolbars = [
          'undo', 'redo', 'bold', 'italic', 'underline', 'strikethrough', 'mark', 'header',
          'ol', 'ul', 'superscript', 'subscript', 'image', 'link', 'video_youtube', 'video_vimeo',
          'code', 'hr', 'table', 'quote'
        ]

        for (let group = 0; group < value.length; group++) {
          for (let toolbar = 0; toolbar < value[group].length; toolbar++) {
            if (toolbars.includes(value[group][toolbar]) === false) {
              return false
            }
          }
        }

        return true
      }
    }
  },
  data () {
    return {
      content_markdown: '',
      actions: {
        undo: {
          icon: 'undo',
          name: 'Undo',
          method: 'undo'
        },
        redo: {
          icon: 'redo',
          name: 'Redo',
          method: 'redo'
        },
        bold: {
          content: {
            prefix: '**',
            dummy: 'Negrita',
            suffix: '**'
          },
          icon: 'format-bold',
          name: 'Negrita',
          newLineRequired: false,
          selectable: true
        },
        italic: {
          content: {
            prefix: '*',
            dummy: 'Cursiva',
            suffix: '*'
          },
          icon: 'format-italic',
          name: 'Cursiva',
          newLineRequired: false,
          selectable: true
        },
        underline: {
          content: {
            prefix: '++',
            dummy: 'Subrayar',
            suffix: '++'
          },
          icon: 'format-underline',
          name: 'Subrayar',
          newLineRequired: false,
          selectable: true
        },
        strikethrough: {
          content: {
            prefix: '~~',
            dummy: 'Tachar',
            suffix: '~~'
          },
          icon: 'format-strikethrough-variant',
          name: 'Tachar',
          newLineRequired: false,
          selectable: true
        },
        mark: {
          content: {
            prefix: '==',
            dummy: 'Marcar',
            suffix: '=='
          },
          icon: 'marker',
          name: 'Marcar',
          newLineRequired: false,
          selectable: true
        },
        header: {
          content: {
            prefix: '### ',
            dummy: 'Cabecera'
          },
          icon: 'format-header-pound',
          name: 'Cabecera',
          newLineRequired: true,
          selectable: true
        },
        ol: {
          content: {
            prefix: '1. ',
            dummy: 'Lista ordenada'
          },
          icon: 'format-list-numbers',
          name: 'Lista ordenada',
          newLineRequired: true,
          selectable: true
        },
        ul: {
          content: {
            prefix: '- ',
            dummy: 'Lista desordenada'
          },
          icon: 'format-list-bulleted',
          name: 'Lista desordenada',
          newLineRequired: true,
          selectable: true
        },
        superscript: {
          content: {
            prefix: '^',
            dummy: 'Sobreíndice',
            suffix: '^'
          },
          icon: 'format-superscript',
          name: 'Sobreíndice',
          newLineRequired: false,
          selectable: true
        },
        subscript: {
          content: {
            prefix: '~',
            dummy: 'Subíndice',
            suffix: '~'
          },
          icon: 'format-subscript',
          name: 'Subíndice',
          newLineRequired: false,
          selectable: true
        },
        image: {
          content: {
            prefix: '![](',
            suffix: ')'
          },
          icon: 'image',
          inputText: 'Escribe el link a una imagen',
          exampleInput: 'https://i.imgur.com/annBL.jpg',
          name: 'Imagen',
          newLineRequired: false,
          selectable: true,
          usesPrompt: true
        },
        link: {
          content: {
            prefix: '[Texto del link](',
            suffix: ')'
          },
          exampleInput: 'http://google.com',
          inputText: 'Introduce un link',
          icon: 'link',
          name: 'Link',
          newLineRequired: false,
          selectable: true,
          usesPrompt: true
        },
        video_youtube: {
          content: {
            prefix: '@[youtube](',
            suffix: ')'
          },
          icon: 'youtube',
          name: 'Video de YouTube',
          inputText: 'Introduce un link de YouTube',
          usesPrompt: true,
          exampleInput: 'https://www.youtube.com/watch?v=cP3B8cOYSdI',
          newLineRequired: false,
          selectable: true
        },
        mfc: {
          content: {
            prefix: '@[mfc](',
            suffix: ')'
          },
          icon: 'mushroom',
          name: 'Figura de MyFigureCollection',
          inputText: 'Introduce un link a una figura de MFC',
          usesPrompt: true,
          exampleInput: 'https://myfigurecollection.net/item/595937',
          newLineRequired: false,
          selectable: true
        },
        video_vimeo: {
          content: {
            prefix: '@[vimeo](',
            dummy: '54800225',
            suffix: ')'
          },
          icon: 'fab fa-vimeo-v',
          name: 'Vimeo video',
          newLineRequired: false,
          selectable: true
        },
        code: {
          content: {
            prefix: '```\n',
            dummy: 'Codigo',
            suffix: '\n```'
          },
          icon: 'code-braces',
          name: 'Codigo',
          newLineRequired: true,
          selectable: true
        },
        hr: {
          content: {
            dummy: '---'
          },
          icon: 'minus',
          name: 'Linea horizontal',
          newLineRequired: true,
          selectable: false
        },
        table: {
          content: {
            prefix: '\n',
            dummy:
                        '| Tables        | Are           | Cool  |\n' +
                        '| ------------- |:-------------:| -----:|\n' +
                        '| col 2 is      | centered      |   $12 |\n' +
                        '| col 3 is      | right-aligned | $1600 |\n' +
                        '| zebra stripes | are neat      |    $1 |',
            suffix: '\n'
          },
          icon: 'table',
          name: 'Table',
          newLineRequired: true,
          selectable: false
        },
        quote: {
          content: {
            prefix: '> ',
            dummy: 'Cita'
          },
          icon: 'format-quote-close',
          name: 'Cita',
          newLineRequired: true,
          selectable: true
        }
      }
    }
  },
  watch: {
    content_markdown (value) {
      this.$emit('html', this.content_html)
      this.$emit('input', value)
      this.updateRows()
    }
  },
  mounted () {
    this.content_markdown = this.value
  },
  methods: {
    counterClass (type = 'md') {
      let classes = ['control-counter', 'is-size-7']

      if (type === 'md' && this.markdownLimit > 0 && this.markdownLimit < this.content_markdown.length) {
        classes.push('is-danger')
      }

      return classes
    },
    updateRows () {
      // autosize(this.$refs.textarea);
    },
    doMethod (method) {
      if (method === 'undo') {
        this.$refs.textarea.focus()
        document.execCommand('undo', false)
      } else if (method === 'redo') {
        this.$refs.textarea.focus()
        document.execCommand('redo', false)
      }
    },
    getCurrentSelection () {
      return this.$refs.textarea.value.substring(
        this.$refs.textarea.selectionStart,
        this.$refs.textarea.selectionEnd
      )
    },
    deleteSelection () {
      if (this.getCurrentSelection().length > 0) {
        this.$refs.textarea.focus()
        this.content_markdown = this.content_markdown.substring(0, this.$refs.textarea.selectionStart) + this.content_markdown.substring(this.$refs.textarea.selectionEnd, this.content_markdown.length)
      }
    },
    getLines () {
      return this.$refs.textarea.value.split(/(?=\r*\n)/)
    },
    getCurrentLineIndex () {
      let lines = this.getLines()
      let counter = 0
      for (let i = 0; i < lines.length; i++) {
        counter += lines[i].length
        if (counter >= this.$refs.textarea.selectionEnd) {
          return i
        }
      }
    },
    isLineEmpty (lineIndex) {
      let string = this.getLines()[lineIndex]

      if (typeof string !== 'string') {
        return null
      }

      if (string === '\n' || string === '\r' || string === '\r\n' || string.length === 0) {
        return true
      }

      return false
    },
    setCaret (position) {
      this.$refs.textarea.selectionStart = position
      this.$refs.textarea.selectionEnd = position
    },
    getLinePosition (lineIndex) {
      let lines = this.getLines()
      let characters = 0

      for (let i = 0; i < lines.length && i < lineIndex; i++) {
        characters += lines[i].length
      }

      return characters
    },
    insertText (text) {
      console.log('inserting...', text)
      this.$refs.textarea.focus()
      this.deleteSelection()
      this.content_markdown = this.content_markdown.substring(0, this.$refs.textarea.selectionStart) + text + this.content_markdown.substring(this.$refs.textarea.selectionStart, this.content_markdown.length)
    },
    selectText (start, end) {
      this.$refs.textarea.selectionStart = start
      this.$refs.textarea.selectionEnd = end
    },
    // select text backwards from caret (length left from caret to ignore, length left to select)
    selectTextBack (aftLength, selectLength) {
      this.selectText(this.$refs.textarea.selectionEnd - aftLength - selectLength,
        this.$refs.textarea.selectionEnd - aftLength)
    },
    doAction (action) {
      // if undo, redo
      if (action.method) {
        this.doMethod(action.method)
        return
      }

      let selectedText = this.getCurrentSelection()
      let desiredContent = action.content.dummy

      if (action.newLineRequired === true) {
        if (action.selectable === true) {
          this.deleteSelection()
        }

        let currentLine = this.getCurrentLineIndex()

        if (this.isLineEmpty(currentLine) === false) {
          this.setCaret(this.getLinePosition(currentLine + 1))
          this.insertText('\n')
        }
      }

      if (action.selectable && selectedText.length > 0) {
        desiredContent = selectedText
        this.insertText(
          (action.content.prefix || '') +
                desiredContent +
                (action.content.suffix || '')
        )
        this.selectTextBack(action.content.suffix ? action.content.suffix.length : 0, desiredContent.length)
      } else if (action.usesPrompt) {
        this.$dialog.prompt({
          message: action.inputText,
          confirmText: 'Insertar',
          cancelText: 'Cancelar',
          inputAttrs: {
            placeholder: action.exampleInput
          },
          onConfirm: (value) => {
            this.insertText(
              (action.content.prefix || '') +
                    value +
                    (action.content.suffix || '')
            )
            this.selectTextBack(action.content.suffix ? action.content.suffix.length : 0, value.length)
          }
        })
      } else {
        this.insertText(
          (action.content.prefix || '') +
                desiredContent +
                (action.content.suffix || '')
        )
      }
    }
  }
}
</script>
<style lang="scss">
    .vue-bulma-text-editor {
        .editor-nav-bar {
            padding: 0.5rem 0.5rem 0;
            width: 100%;
            display: flex;
            flex-wrap: wrap;
            .group {
                margin-bottom: 0.5rem;
                &:not(:last-child) {
                    margin-right: 0.5rem;
                }
            }
        }
        .editor-preview {
            @media screen and (min-width: 768px) {
                border-left: 1px solid rgba(10, 10, 10, 0.1);
            }
            overflow-wrap: break-word;
            .content {
                margin-left: 0.5rem;
                /*word-break: break-word;*/
            }
        }
        .editor-field {
            textarea {
                /*height: 100%;*/
                display: block;
                width: 100%;
                padding: 0.5rem;
                font-size:1rem;
                resize: none;
                /*overflow: hidden !important;*/
                border: none;
                outline: none;
            }
        }
        .editor-field, .editor-preview {
            position: relative;
            .scrollable {
                overflow-y: scroll;
                overflow-x: auto;

                &::-webkit-scrollbar {
                    width: 0.5em;
                }

                &::-webkit-scrollbar-track {
                    -webkit-box-shadow: inset 0 0 0 0 rgba(10, 10, 10, 0.1);
                }

                &::-webkit-scrollbar-thumb {
                    background-color: hsl(204, 86%, 53%);
                    outline: 1px solid hsl(204, 86%, 53%);
                }
            }
        }
        .control-counter {
            color: white;
            background-color: hsl(204, 86%, 53%);
            height: 18px;
            pointer-events: none;
            position: absolute;
            min-width: 18px;
            padding: 0 1.25em 0 0.75em;
            z-index: 4;
            bottom: 0;
            right: 0;
            text-align: center;
            &.is-danger {
                background-color: hsl(348, 100%, 61%);
            }
        }
    }
</style>
