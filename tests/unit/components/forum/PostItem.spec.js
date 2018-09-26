import { shallowMount, mount, createLocalVue } from '@vue/test-utils'
import PostItem from '@/components/forum/PostItem.vue'
import flushPromises from 'flush-promises'
import Vuex from 'vuex'

import mockPost from '../../../mockData/mockPost'
import mockUser from '../../../mockData/mockUser'
import Forum from '@/api/forum'
const localVue = createLocalVue()

localVue.use(Vuex)

jest.mock('@/api/forum', () => ({
  deletePost: jest.fn(() => Promise.resolve({})),
  updatePost: jest.fn(() => Promise.resolve({}))
}))

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
  it('startEditing enables editing', () => {
    const wrapper = mount(PostItem, { store,
      propsData: {
        isOP: true,
        post: mockPost
      },
      stubs: ['router-link', 'router-view', 'b-dropdown-item', 'b-dropdown'],
      localVue
    })
    expect(wrapper.vm.editing).toBe(false)
    wrapper.vm.startEditing()
    expect(wrapper.vm.editing).toBe(true)
  })
  it('cancelEditing disables editing', () => {
    const wrapper = mount(PostItem, { store,
      propsData: {
        isOP: true,
        post: mockPost
      },
      stubs: ['router-link', 'router-view', 'b-dropdown-item', 'b-dropdown'],
      localVue
    })
    expect(wrapper.vm.editing).toBe(false)
    wrapper.vm.startEditing()
    expect(wrapper.vm.editing).toBe(true)
    wrapper.vm.cancelEditing()
    expect(wrapper.vm.editing).toBe(false)
  })
  it('cancelEditing calls changePost event', () => {
    const wrapper = mount(PostItem, { store,
      propsData: {
        isOP: true,
        post: mockPost
      },
      stubs: ['router-link', 'router-view', 'b-dropdown-item', 'b-dropdown'],
      localVue
    })
    expect(wrapper.vm.editing).toBe(false)
    wrapper.vm.startEditing()
    expect(wrapper.vm.editing).toBe(true)
    wrapper.vm.cancelEditing()
    expect(wrapper.vm.editing).toBe(false)
    expect(wrapper.emitted().changePost).toBeTruthy()
    expect(wrapper.emitted().changePost.length).toBe(1)
  })

  it('deletePost calls Forum.deletePost', () => {
    const wrapper = mount(PostItem, { store,
      propsData: {
        isOP: true,
        post: mockPost
      },
      stubs: ['router-link', 'router-view', 'b-dropdown-item', 'b-dropdown'],
      localVue
    })
    wrapper.vm.deletePost()
    expect(Forum.deletePost).toHaveBeenCalledWith(mockPost.id, '')
  })
  it('saveEditing calls Forum.updatePost', () => {
    const wrapper = mount(PostItem, { store,
      propsData: {
        isOP: true,
        post: mockPost
      },
      stubs: ['router-link', 'router-view', 'b-dropdown-item', 'b-dropdown'],
      localVue
    })
    expect(wrapper.vm.editing).toBe(false)
    wrapper.vm.startEditing()
    expect(wrapper.vm.editing).toBe(true)
    wrapper.vm.saveEditing()
    expect(Forum.updatePost).toHaveBeenCalledWith(mockPost.id, mockPost.content)
  })
  it('askDeletePost opens modal', () => {
    const wrapper = mount(PostItem, { store,
      propsData: {
        isOP: true,
        post: mockPost
      },
      stubs: ['router-link', 'router-view', 'b-dropdown-item', 'b-dropdown'],
      localVue
    })
    expect(wrapper.vm.editing).toBe(false)
    wrapper.vm.startEditing()
    expect(wrapper.vm.editing).toBe(true)
    wrapper.vm.saveEditing()
    expect(Forum.updatePost).toHaveBeenCalledWith(mockPost.id, mockPost.content)
  })
  it('renders properly', () => {
    var post = mockPost
    var date = new Date()

    date.setDate(date.getDate() - 3)
    post.created = date.toISOString()

    const wrapper = shallowMount(PostItem, { store,
      localVue,
      stubs: ['router-link', 'router-view'],
      propsData: {
        isOP: false,
        post: { ...mockPost, ...{ content: '# Test' } }
      }
    })
    expect(wrapper.element).toMatchSnapshot()
  })
})
