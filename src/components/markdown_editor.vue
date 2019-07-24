<template>
  <div class="editor">
    
    <editor-menu-bubble :editor="editor" :keep-in-bounds="true" v-slot="{ commands, isActive, menu, getMarkAttrs }">
      <div
        class="menububble buttons"
        :class="{ 'is-active': menu.isActive }"
        :style="`left: ${menu.left}px; bottom: ${menu.bottom}px;`"
      >
      <form class="menububble__form" v-if="linkMenuIsActive" @submit.prevent="setLinkUrl(commands.link, linkUrl)">
        <b-input v-model="linkUrl" placeholder="https://" ref="linkInput" @keydown.esc="hideLinkMenu"/>
        <button class="menububble__button" @click="setLinkUrl(commands.link, null)" type="button">
        </button>
      </form>
      <template v-else>
        <b-button class="bubble-button" @click="showLinkMenu(getMarkAttrs('link'))" :outlined="isActive.link()" type="is-primary" icon-left="link">
        </b-button>
        <b-button
          class="bubble-button"
          @click="commands.bold"
          icon-left="format-bold"
          type="is-primary"
          :outlined="isActive.bold()"
        >
        </b-button>
        
        <b-button
          class="bubble-button"
          @click="commands.italic"
          icon-left="format-italic"
          type="is-primary"
          :outlined="isActive.italic()"
          
        >
        </b-button>


        <b-button
          class="bubble-button"
          @click="commands.code_block"
          icon-left="code-braces"
          type="is-primary"
          :outlined="isActive.code_block()"
          
        >
        </b-button>
      </template>
      </div>
    </editor-menu-bubble>
    <editor-menu-bar :editor="editor" v-slot="{ commands, isActive }">
      <div class="buttons">

        <b-button
          type="is-primary"
          @click="commands.bold"
          icon-right="format-bold"
          :outlined="isActive.bold()"
        >
        </b-button>
        <b-button
          type="is-primary"
          @click="commands.italic"
          icon-right="format-italic"
          :outlined="isActive.italic()"
        >
        </b-button>

        <b-button
          type="is-primary"
          @click="commands.strike"
          icon-right="format-strikethrough"
          :outlined="isActive.strike()"
        >
        </b-button>


        <b-button
          type="is-primary"
          @click="commands.underline"
          icon-right="format-underline"
          :outlined="isActive.underline()"
        >
        </b-button>

        <b-button
          type="is-primary"
          @click="commands.code_block"
          icon-right="code-braces"
          :outlined="isActive.code_block()"
        >
        </b-button>

        <b-button
          type="is-primary"
          @click="commands.heading({ level: 1 })"
          icon-right="format-header-1"
          :outlined="isActive.heading({ level: 1 })"
        >
        </b-button>

        <b-button
          type="is-primary"
          @click="commands.heading({ level: 2 })"
          icon-right="format-header-2"
          :outlined="isActive.heading({ level: 2 })"
        >
        </b-button>

        <b-button
          type="is-primary"
          @click="commands.heading({ level: 3 })"
          icon-right="format-header-3"
          :outlined="isActive.heading({ level: 3 })"
        >
        </b-button>

        <b-button
          type="is-primary"
          @click="commands.bullet_list"
          icon-right="format-list-bulleted"
          :outlined="isActive.bullet_list()"
        >
        </b-button>
        <b-button
          type="is-primary"
          @click="commands.ordered_list"
          icon-right="format-list-numbers"
          :outlined="isActive.ordered_list()"
        >
        </b-button>
        <b-button
          type="is-primary"
          @click="commands.center"
          icon-right="format-align-center"
          :outlined="isActive.center()"
        >
        </b-button>
        <b-button
          type="is-primary"
          @click="commands.spoiler"
          icon-right="eye"
          :outlined="isActive.spoiler()"
        >
        </b-button>
        <b-button @click="test()">test</b-button>
      </div>
    </editor-menu-bar>
    <div class="editor-container">
      <div class="emoji-invoker">
      <v-popover
          placement="bottom-center"
          offset="16"
          :disabled="!showEmojiPicker">
          <b-button type="is-text" @click="showEmojiPicker = true" size="is-medium" icon-left="emoticon-outline"></b-button>

          <template slot="popover">
            <div class=""><div class="emoji-picker"><EmojiPicker @select="selectEmoji"></EmojiPicker></div></div>
            
          </template>
        </v-popover>
      </div>

      <editor-content class="content" :editor="editor" />
    </div>
    <div class="buttons">
      <b-button
        icon-left="export"
        @click="showJSON">Exportar</b-button>
      <b-button
        icon-left="export"
        @click="showDOM">Exportar DOM</b-button>
    </div>
  </div>
</template>

<script>
import { createEditor } from '@/components/Editor'
import { EditorContent, EditorMenuBar, EditorMenuBubble } from 'tiptap'
import EmojiPicker from '@/components/EmojiPicker'
import twemoji from 'twemoji'
export default {
  components: {
    EditorContent,
    EditorMenuBar,
    EditorMenuBubble,
    EmojiPicker
  },
  props: ["value"],
  methods: {
    selectEmoji(emoji) {
      const node = this.editor.view.state.schema.nodes.emoji.create({
        'data-emoji': emoji.native
      })
      const pos = this.editor.view.state.selection.from
      const transaction = this.editor.view.state.tr.insert(pos, node)
      this.editor.view.dispatch(transaction)
    },
    showJSON() {
      this.$dialog.alert({
        title: 'Codigo del post',
        message: `<textarea class="textarea" readonly>${JSON.stringify(this.editor.getJSON(), null, 2)}</textarea>`,
        confirmText: 'Aceptar'
      })
    },
    test () {
      this.$dialog.prompt({
                    message: `What's your name?`,
                    inputAttrs: {
                        placeholder: 'e.g. Walter',
                    },
                    onConfirm: (value) => this.editor.setContent(JSON.parse(value))
                })
    },
    insertQuote (id, username, content) {
      const pos = this.editor.view.state.selection.anchor
      const { schema } = this.editor.view.state
      const node = schema.nodes.quote.create({
        'data-username': username,
        'data-id': id,
        'data-content': content
      })
      const transaction = this.editor.view.state.tr.insert(pos, node)
      this.editor.view.dispatch(transaction)
    },
    showDOM() {
      this.$dialog.alert({
        title: 'Codigo del post',
        message: `<textarea class="textarea" readonly>${this.editor.getHTML()}</textarea>`,
        confirmText: 'Aceptar'
      })
    },
      showLinkMenu(attrs) {
      this.linkUrl = attrs.href
      this.linkMenuIsActive = true
      this.$nextTick(() => {
        this.$refs.linkInput.focus()
      })
    },
    hideLinkMenu() {
      this.linkUrl = null
      this.linkMenuIsActive = false
    },
    setLinkUrl(command, url) {
      command({ href: url })
      this.hideLinkMenu()
      this.editor.focus()
    },
  },
  data() {
    return {
      linkMenuIsActive: false,
      linkUrl: null,
      showEmojiPicker: false,
      editor: createEditor({
        onUpdate: ({getJSON, getHTML}) => {
          this.$emit('input', JSON.stringify(getJSON()))
        }
      })
    }
  },
  beforeDestroy() {
    this.editor.destroy()
  }
}
</script>
<style lang="scss">
$color-black: #000;
$color-white: #fff;
$color-grey: #333;
.menububble {
  position: absolute;
  display: flex;
  z-index: 20;
  background: #fff;
  box-shadow: 0 2px 3px rgba(10, 10, 10, 0.1), 0 0 0 1px rgba(10, 10, 10, 0.1);
  border-radius: 10px;
  padding: 0.5rem;
  margin-bottom: 0rem;
  transform: translateX(-50%);
  visibility: hidden;
  opacity: 0;
  transition: opacity 0.2s, visibility 0.2s;

  &.is-active {
    opacity: 1;
    visibility: visible;
  }

  &__button {
    display: inline-flex;
    background: transparent;
    border: 0;
    color: $color-white;
    padding: 0.2rem 0.5rem;
    margin-right: 0.2rem;
    border-radius: 3px;
    cursor: pointer;

    &:last-child {
      margin-right: 0;
    }

    &:hover {
      background-color: rgba($color-white, 0.1);
    }

    &.is-active {
      background-color: rgba($color-white, 0.2);
    }
  }

  &__form {
    display: flex;
    align-items: center;
  }

  &__input {
    font: inherit;
    border: none;
    background: transparent;
    color: $color-white;
  }
}
.bubble-button {
  margin-bottom: 0rem !important;
}
[contenteditable]:focus {
    outline: 0px solid transparent;
}

.editor-container {
  position: relative;
}

.emoji-invoker {
  position: absolute;
  right: 0;
  top: 0;
  z-index: 10000;
}


</style>
