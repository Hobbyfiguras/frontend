import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vue from 'vue'

import petitions from '@/components/mixins/petitions'

import Forum from '@/api/forum'

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

Vue.mixin(petitions)

describe('petitions.js', () => {
  let store
  beforeEach(() => {

  })
  it('calls petition', () => {
    const wrapper = shallowMount({ template: '<div></div>' }, { store,
      localVue,
      stubs: baseStubs
    })
    expect(wrapper.vm.makePetition(Forum.deletePost()))
    expect(Forum.deletePost).toHaveBeenCalled()
  })
  it('throws error on petition error', () => {
    const wrapper = shallowMount({ template: '<div></div>' }, { store,
      localVue,
      stubs: baseStubs
    })
    const result = wrapper.vm.makePetition(Forum.updatePost())
    expect(result).rejects.toEqual(new Error())
  })
  it('sets error data properly', () => {
    const wrapper = shallowMount({
      template: '<div></div>',
      data () {
        return {
          errors: {
            username: null,
            password: null
          }
        }
      }
    },
    {
      store,
      localVue,
      stubs: baseStubs
    })
    const errors = {
      'username': [
        'Este campo no puede estar en blanco.'
      ],
      'password': [
        'Password not white.'
      ]
    }
    wrapper.vm.setErrors(errors)
    expect(wrapper.vm.errors.username).toBe('Este campo no puede estar en blanco.')
    expect(wrapper.vm.errors.password).toBe('Password not white.')
  })
})
