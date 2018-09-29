import { mount, createLocalVue } from '@vue/test-utils'
import Vue from 'vue'

import NSFWWarningMixin from '@/components/mixins/NSFWWarningMixin'

import Vuex from 'vuex'

const localVue = createLocalVue()

jest.mock('@/api/forum', () => ({
  deletePost: jest.fn(() => Promise.resolve({})),
  updatePost: jest.fn(() => Promise.reject(new Error()))
}))

const baseStubs = {
  'router-link': true,
  'router-view': true,
  transition: false
}

Vue.mixin(NSFWWarningMixin)
Vue.use(Vuex)
describe('NSFWWarningMixin.js', () => {
  let store
  let settingsActions = {
    setNSFW: jest.fn()
  }
  beforeEach(() => {
    store = new Vuex.Store({
      modules: {
        auth: {
          state: {
            currentUser: null
          }
        },
        settings: {
          namespaced: true,
          actions: settingsActions
        }
      }
    })
  })
  it('askNSFW opens modal', () => {
    const wrapper = mount({ template: '<div></div>' }, { store,
      localVue,
      stubs: baseStubs
    })
    wrapper.vm.askNSFW()
    const modal = wrapper.find('.modal')
    wrapper.vm.$nextTick(() => {
      expect(modal.exists()).toBe(true)
    })
  })
  it('calls setNSFW on the settings store when the modal is accepted', () => {
    const wrapper = mount({ template: '<div></div>' }, { store,
      localVue,
      stubs: baseStubs
    })
    wrapper.vm.askNSFW()
    const modal = wrapper.find('.modal')
    wrapper.vm.$nextTick(() => {
      modal.find('.is-danger').trigger('click')
      expect(settingsActions.setNSFW).toHaveBeenCalledWith(expect.any(Object), true, undefined)
    })
  })
  it('calls routerback on the settings store when the modal is cancelled', () => {
    const wrapper = mount({ template: '<div></div>' }, { store,
      localVue,
      stubs: baseStubs
    })
    wrapper.vm.$router = { go: jest.fn() }
    wrapper.vm.askNSFW()
    const modal = wrapper.find('.modal')
    wrapper.vm.$nextTick(() => {
      modal.find('.button').trigger('click')
      expect(wrapper.vm.$router.go).toHaveBeenCalledWith(-1)
    })
  })
})
