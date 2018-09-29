import { shallowMount, mount, createLocalVue } from '@vue/test-utils'
import PostItem from '@/components/forum/PostItem.vue'
import flushPromises from 'flush-promises'
import Vuex from 'vuex'

import mockPost from '../../../mockData/mockPost'
import mockUser from '../../../mockData/mockUser'
import mockSettings from '../../../mockData/mockSettings'

import Forum from '@/api/forum'
const localVue = createLocalVue()

localVue.use(Vuex)

jest.mock('@/api/forum', () => ({
  deletePost: jest.fn(() => Promise.resolve({})),
  updatePost: jest.fn(() => Promise.resolve({})),
  votePost: jest.fn(() => Promise.resolve({}))
}))

const baseStubs = {
  'router-link': true,
  'router-view': true,
  transition: false
}

describe('PostItem.vue', () => {
  let store
  beforeEach(() => {
    store = new Vuex.Store({
      modules: {
        auth: {
          state: {
            currentUser: mockUser
          }
        },
        forum: {
          state: {
            forumSettings: mockSettings
          }
        }
      }
    })
  })
  it('getMeta is empty array if isOP is false', () => {
    const wrapper = shallowMount(PostItem, { store,
      localVue,
      stubs: baseStubs,
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
      stubs: baseStubs,
      localVue
    })
    await flushPromises()
    expect(wrapper.vm.getMeta()).not.toHaveLength(0)
  })
  it('strips markdown from post description', async () => {
    const wrapper = shallowMount(PostItem, { store,
      localVue,
      stubs: baseStubs,
      propsData: {
        isOP: false,
        post: { ...mockPost, ...{ content: '# Test' } }
      }
    })
    await flushPromises()
    expect(wrapper.vm.prettyDesc).toBe('Test')
  })
  it('Clicking the start editing button enables editing', () => {
    const wrapper = mount(PostItem, { store,
      propsData: {
        isOP: true,
        post: mockPost
      },
      stubs: baseStubs,
      localVue
    })
    expect(wrapper.vm.editing).toBe(false)
    wrapper.find({ ref: 'editButton' }).trigger('click')
    expect(wrapper.vm.editing).toBe(true)
  })
  it('Clicking the cancel edit button disables editing', () => {
    const wrapper = mount(PostItem, { store,
      propsData: {
        isOP: true,
        post: mockPost
      },
      stubs: baseStubs,
      localVue
    })
    expect(wrapper.vm.editing).toBe(false)
    wrapper.find({ ref: 'editButton' }).trigger('click')
    expect(wrapper.vm.editing).toBe(true)
    wrapper.vm.$nextTick(() => {
      wrapper.find({ ref: 'cancelEditButton' }).trigger('click')
      expect(wrapper.vm.editing).toBe(false)
    })
  })
  it('Clicking the cancel edit button calls changePost event', () => {
    const wrapper = mount(PostItem, { store,
      propsData: {
        isOP: true,
        post: mockPost
      },
      stubs: baseStubs,
      localVue
    })
    wrapper.find({ ref: 'editButton' }).trigger('click')
    wrapper.vm.$nextTick(() => {
      wrapper.find({ ref: 'cancelEditButton' }).trigger('click')
      expect(wrapper.emitted().changePost).toBeTruthy()
      expect(wrapper.emitted().changePost.length).toBe(1)
    })
  })
  it('Clicking the delete post button opens a modal', () => {
    const wrapper = mount(PostItem, { store,
      propsData: {
        isOP: true,
        post: mockPost
      },
      stubs: baseStubs,
      localVue
    })
    wrapper.find({ ref: 'deleteButton' }).trigger('click')
    const modal = wrapper.find('.modal')
    wrapper.vm.$nextTick(() => {
      expect(modal.exists()).toBe(true)
    })
  })
  it('Clicking the delete button in the delete modal calls Forum.deletePost', () => {
    const wrapper = mount(PostItem, { store,
      propsData: {
        isOP: true,
        post: mockPost
      },
      stubs: baseStubs,
      localVue
    })
    wrapper.find({ ref: 'deleteButton' }).trigger('click')
    const modal = wrapper.find('.modal')
    wrapper.vm.$nextTick(() => {
      modal.find('.is-danger').trigger('click')
      expect(Forum.deletePost).toHaveBeenCalled(mockPost.id, mockPost.content)
    })
  })
  it('Clicking the save editing button calls Forum.updatePost', () => {
    const wrapper = mount(PostItem, { store,
      propsData: {
        isOP: true,
        post: mockPost
      },
      stubs: baseStubs,
      localVue
    })
    wrapper.find({ ref: 'editButton' }).trigger('click')
    wrapper.vm.$nextTick(() => {
      wrapper.find({ ref: 'saveEditButton' }).trigger('click')
      expect(wrapper.emitted().updatePost).toBeTruthy()
    })
  })

  it('Voting calls Forum.votePost', () => {
    var post = mockPost

    post.creator.id = 'LRLE'

    const wrapper = shallowMount(PostItem, { store,
      propsData: {
        isOP: true,
        post: post
      },
      stubs: baseStubs,
      localVue
    })
    wrapper.find('.level-vote').find('btooltip-stub').find('figure').trigger('click')
    expect(Forum.votePost).toHaveBeenCalledWith(post.id, '8GCN')
  })
  it('renders properly', () => {
    var post = mockPost
    var date = new Date()

    date.setDate(date.getDate() - 3)
    post.created = date.toISOString()
    post.creator.id = 'LRLE'

    const wrapper = shallowMount(PostItem, { store,
      localVue,
      stubs: baseStubs,
      propsData: {
        isOP: false,
        post: { ...post, ...{ content: '# Test' } }
      }
    })
    expect(wrapper.element).toMatchSnapshot()
  })
})
