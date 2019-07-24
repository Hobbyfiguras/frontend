import { Editor, Doc, Text } from 'tiptap'
import {
  Blockquote,
  CodeBlock,
  HardBreak,
  Heading,
  HorizontalRule,
  OrderedList,
  BulletList,
  ListItem,
  TodoItem,
  TodoList,
  Bold,
  Code,
  Italic,
  Link,
  Strike,
  Underline,
  History,
  Suggestions
} from 'tiptap-extensions'


import Center from '@/editor_plugins/Center'
import Image from '@/editor_plugins/Image'
import Spoiler from '@/editor_plugins/Spoiler'
import MFC from '@/editor_plugins/MFC'
import Quote from '@/editor_plugins/Quote'
import Emoji from '@/editor_plugins/Emoji'
import YT from '@/editor_plugins/YouTube'
function createEditor (options = {}) {
  return new Editor({
    ...options,
    extensions: [
      new Blockquote(),
      new BulletList(),
      new CodeBlock(),
      new HardBreak(),
      new Heading({ levels: [1, 2, 3] }),
      new HorizontalRule(),
      new ListItem(),
      new OrderedList(),
      new TodoItem(),
      new TodoList(),
      new YT(),
      new Emoji(),
      new Image(),
      new Link(),
      new Bold(),
      new Code(),
      new Italic(),
      new Strike(),
      new Underline(),
      new History(),
      new Center(),
      new MFC(),
      new Quote(),
      new Spoiler()
    ]
  })
}
export {
  createEditor
}