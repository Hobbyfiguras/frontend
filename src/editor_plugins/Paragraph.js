import { setBlockType } from 'tiptap-commands'
import { Node } from 'tiptap'

export default class Paragraph extends Node {

  get name() {
    return 'paragraph'
  }

  get schema() {
    return {
      content: 'inline',
      group: 'block',
      priority: 51,
      draggable: false,
      parseDOM: [{
        tag: 'p',
      }],
      toDOM: () => ['p', 0],
    }
  }

  commands({ type }) {
    return () => setBlockType(type)
  }
}
