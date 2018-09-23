import { shallowMount, mount, createLocalVue } from '@vue/test-utils'
import PostItem from '@/components/forum/PostItem.vue'
import flushPromises from 'flush-promises'
import Vuex from 'vuex'

import mockPost from '../../../mockData/mockPost'
import mockUser from '../../../mockData/mockUser'

const localVue = createLocalVue()

localVue.use(Vuex)

describe('PostItem.vue', () => {
  let state
  let store
  beforeEach(() => {
    state = {
      currentUser: mockUser
    }

    store = new Vuex.Store({
      modules: {
        auth: {
          state
        }
      }
    })
  })
  it('getMeta is empty array if isOP is false', () => {
    const wrapper = shallowMount(PostItem, { store,
      localVue,
      stubs: ['router-link', 'router-view'],
      propsData: {
        isOP: false,
        post: mockPost
      }
    })
    expect(wrapper.vm.getMeta()).toHaveLength(0)
  })
  it('getMeta is object if isOP is true', async () => {
    const wrapper = mount(PostItem, { store,
      propsData: {
        isOP: true,
        post: mockPost
      },
      stubs: ['router-link', 'router-view', 'b-dropdown-item', 'b-dropdown'],
      localVue
    })
    await flushPromises()
    console.log(wrapper.vm.getMeta())
    expect(wrapper.vm.getMeta()).not.toHaveLength(0)
  })
  it('strips markdown from post description', async () => {
    const wrapper = shallowMount(PostItem, { store,
      localVue,
      stubs: ['router-link', 'router-view'],
      propsData: {
        isOP: false,
        post: { ...mockPost, ...{ content: '# Test' } }
      }
    })
    await flushPromises()
    expect(wrapper.vm.prettyDesc).toBe('Test')
  })
  it('edit button enables editing', () => {
    const wrapper = mount(PostItem, { store,
      propsData: {
        isOP: true,
        post: mockPost
      },
      stubs: ['router-link', 'router-view', 'b-dropdown-item', 'b-dropdown'],
      localVue
    })
    expect(wrapper.vm.editing).toBe(false)
    wrapper.find({ ref: 'editButton' }).trigger('click')
    // wrapper.vm.startEditing()
    expect(wrapper.vm.editing).toBe(true)
  })
})
