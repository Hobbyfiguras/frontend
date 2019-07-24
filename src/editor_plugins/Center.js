import { Node } from 'tiptap'
import { wrappingInputRule, toggleWrap } from 'tiptap-commands'

export default class Center extends Node {

  get name() {
    return 'center'
  }

  get schema() {
    return {
      content: 'block*',
      group: 'block',
      defining: true,
      draggable: false,
      parseDOM: [
        { tag: 'div[class]', class: 'text-align-center' },
      ],
      toDOM: () => ['div', {class: 'text-align-center'}, 0],
    }
  }

  commands({ type, schema }) {
    return () => toggleWrap(type, schema.nodes.paragraph)
  }

  keys({ type }) {
    return {
      'Ctrl-Shift-C': toggleWrap(type),
    }
  }

  inputRules({ type }) {
    return [
      wrappingInputRule(/^\s*>\s$/, type),
    ]
  }

}
