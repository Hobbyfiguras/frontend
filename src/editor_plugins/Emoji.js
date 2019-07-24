import { Node, Plugin } from 'tiptap'
import { nodeInputRule } from 'tiptap-commands'
import EmojiComponent from '@/editor_plugins/EmojiComponent'
/**
 * Matches following attributes in Markdown-typed image: [, alt, src, title]
 *
 * Example:
 * ![Lorem](image.jpg) -> [, "Lorem", "image.jpg"]
 * ![](image.jpg "Ipsum") -> [, "", "image.jpg", "Ipsum"]
 * ![Lorem](image.jpg "Ipsum") -> [, "Lorem", "image.jpg", "Ipsum"]
 */
const EMOJI_REGEX = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g

export default class Image extends Node {

  get name() {
    return 'emoji'
  }

  get schema() {
    return {
      inline: true,
      attrs: {
        'data-emoji': {}
      },
      group: 'inline',
      draggable: false,
      selectable: true,
      parseDOM: [
        {
          tag: 'span[data-emoji]',
          getAttrs: dom => ({
            'data-emoji': dom.getAttribute('data-emoji')
          }),
        },
      ],
      toDOM: node => ['span', node.attrs, node.attrs['data-emoji']],
    }
  }

  commands({ type }) {

  }

  inputRules({ type }) {
    return [
      nodeInputRule(EMOJI_REGEX, type, match => {
        const [, emoji] = match
        return {
          'data-emoji': emoji
        }
      })
    ]
  }
  get view () {
   return EmojiComponent 
  }
  get plugins() {
    return [
      new Plugin({
        props: {
          handleDOMEvents: {
            paste(view, event) {
              var clipboardData, pastedData
              
              const initialpos = view.state.selection.from
              
              clipboardData = event.clipboardData
              pastedData = clipboardData.getData('Text')
              
              var transaction = view.state.tr.insertText(pastedData)
              view.dispatch(transaction)
              
              var match
              EMOJI_REGEX.lastIndex = 0
              // Compensating for string length changes (for example, when replacing two character emojis)
              var indexCompensation = 0

              var result = EMOJI_REGEX.exec(pastedData)

              if (!result) {
                return
              }

              event.preventDefault()
              event.stopPropagation()

              EMOJI_REGEX.lastIndex = 0

              while ((match = EMOJI_REGEX.exec(pastedData)) != null) {
                const pos = initialpos+match.index
                const node = view.state.schema.nodes.emoji.create({
                  'data-emoji': match[0]
                })
                transaction = view.state.tr.replaceRangeWith(pos-indexCompensation, pos+match[0].length-indexCompensation, node)
                view.dispatch(transaction)
                indexCompensation += -1+match[0].length
              }
            }
          },
        },
      }),
    ]
  }
}
