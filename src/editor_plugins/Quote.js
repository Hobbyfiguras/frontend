import { Node } from 'tiptap'
import UserQuoteComponent from '@/editor_plugins/UserQuoteComponent'

export default class YouTube extends Node {
  
  get name() {
    return 'quote'
  }
  get schema() {
    return {
      attrs: {
        'data-username': {
          default: null,
        },
        'data-id': {
          default: null,
        },
        'data-content': {
          default: null,
        }
      },
      group: 'block',
      inline: false,
      parseDOM: [{
        tag: 'span[data-content][data-username][data-id]',
        getAttrs: dom => ({
          'data-username': dom.getAttribute('data-username'),
          'data-id': dom.getAttribute('data-id'),
          'data-content': dom.getAttribute('data-content'),
        }),
      }],
      toDOM: node => ['span', {
        'data-content': node.attrs['data-content'],
        'data-id': node.attrs['data-id'],
        'data-username': node.attrs['data-username'],
      }, `[Quote: ${node.attrs['data-id']} ${node.attrs['data-username']}]`],
    }
  }
  
  get view() {
    return UserQuoteComponent
  }
}