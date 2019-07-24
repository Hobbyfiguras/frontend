import { Node, Mark, Plugin } from 'tiptap'
import YT from '@/editor_plugins/YouTubeComponent'
import { pasteRule } from 'tiptap-commands'

export default class YouTube extends Node {
  
  get name() {
    return 'youtube'
  }
  pasteRules({ type }) {
    return [
      /*pasteRule(
        /http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-\_]*)(&(amp;)?[\w\?‌​=]*)?/g,
        type,
        url => {
          var regex = /http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-\_]*)(&(amp;)?[\w\?‌​=]*)?/
          var id = regex.exec(url)[1]
          return ({ 'data-youtube-id': id })
        },
      ),*/
    ]
  }
  get schema() {
    return {
      attrs: {
        'data-youtube-id': {
          default: null,
        },
      },
      group: 'block',
      marks: '',
      selectable: false,
      parseDOM: [{
        tag: 'span[data-youtube-id]',
        getAttrs: dom => ({
          'data-youtube-id': dom.getAttribute('data-youtube-id'),
        }),
      }],
      toDOM: node => ['span', {
        'data-youtube-id': node.attrs['data-youtube-id'],
      }, `[Youtube: ${node.attrs['data-youtube-id']}]`],
    }
  }
  
  get view() {
    return YT
  }
  get plugins() {
    return [
      new Plugin({
        props: {
          handleDOMEvents: {
            paste(view, event) {
              var clipboardData, pastedData
          
              clipboardData = event.clipboardData
              pastedData = clipboardData.getData('Text')
              console.log('paste', pastedData)
              const YT_REGEX = /http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-\_]*)(&(amp;)?[\w\?‌​=]*)?/g

              var result = YT_REGEX.exec(pastedData)

              if (!result) {
                return
              }

              event.preventDefault()

              const { schema } = view.state
              const pos = view.state.selection.anchor
              const node = schema.nodes.youtube.create({
                'data-youtube-id': result[1]
              })
              const transaction = view.state.tr.insert(pos, node)
              view.dispatch(transaction)
            }
          }
        }
      })
    ]
  }
}