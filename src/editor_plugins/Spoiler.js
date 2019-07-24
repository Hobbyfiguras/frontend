import { Mark } from 'tiptap'
import { toggleMark } from 'tiptap-commands'

export default class Spoiler extends Mark {

  get name() {
    return 'spoiler'
  }

  get schema() {
    return {
      parseDOM: [
        {
          tag: 'span[spoiler]',
          class: 'spoiler',
        },
      ],
      toDOM: () => ['span', {class: 'spoiler', 'spoiler': ''},  0],
    }
  }

  commands({ type }) {
    return () => toggleMark(type)
  }
}
