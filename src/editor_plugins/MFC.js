import { Node, Mark, Plugin } from 'tiptap'
import MFC from '@/editor_plugins/MFCComponent'
import { pasteRule } from 'tiptap-commands'

export default class mfc extends Node {
  
  get name() {
    return 'mfc'
  }
  get schema() {
    return {
      attrs: {
        'data-mfc-id': {
          default: null,
        },
      },
      group: 'inline',
      marks: '',
      inline: true,
      parseDOM: [{
        tag: 'span[data-mfc-id]',
        getAttrs: dom => ({
          'data-mfc-id': dom.getAttribute('data-mfc-id'),
        }),
      }],
      toDOM: node => ['span', {
        'data-mfc-id': node.attrs['data-mfc-id'],
      }, `[MFC: ${node.attrs['data-mfc-id']}]`],
    }
  }
  
  get view() {
    return MFC
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
              const MFC_REGEX = /^http(?:s?):\/\/(?:.*\.)?(?:.\.)?myfigurecollection\.net\/item\/([a-zA-Z0-9]{1,13}).*/g
              var result = MFC_REGEX.exec(pastedData)
              if (!result) {
                return
              }

              event.preventDefault()
              event.stopPropagation()

              const { schema } = view.state
              const pos = view.state.selection.anchor
              const node = schema.nodes.mfc.create({
                'data-mfc-id': result[1]
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