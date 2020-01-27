/* eslint-disable no-template-curly-in-string */
import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import NewScript from '../../../src/views/NewScript'
import * as schemas from '../../test-schemas'
import BootstrapVue from 'bootstrap-vue'

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(BootstrapVue)
localVue.filter('i18n', jest.fn())

describe('views/NewScript.vue', () => {
  let actions
  let store
  let wrapper
  let $router

  beforeEach(() => {
    $router = {
      push: jest.fn()
    }
    actions = {
      newParametersAndScripts: jest.fn().mockResolvedValue({}),
      addParameters: jest.fn().mockResolvedValue({}),
      editScript: jest.fn().mockResolvedValue({})
    }
    store = new Vuex.Store({
      state: {
        scripts: schemas.Script,
        scriptTypes: schemas.ScriptType,
        loaded: true
      },
      actions
    })
    wrapper = shallowMount(NewScript, {
      store,
      localVue,
      mocks: {
        $router
      },
      stubs: ['font-awesome-icon']
    })
  })

  it('can check if the chosen name is unique', () => {
    wrapper.setData({ form: { name: 'Jan modaal' } })
    expect(wrapper.vm.isUniqueName).toBeTruthy()
    wrapper.setData({ form: { name: 'test' } })
    expect(wrapper.vm.isUniqueName).toBeFalsy()
  })

  it('creates new script on submit', (done) => {
    const form = { nameChanged: false, form: { name: 'UniqueName', content: 'script' } }
    wrapper.setData(form)
    wrapper.vm.onSubmit()
    setTimeout(() => {
      expect(actions.newParametersAndScripts).toHaveBeenCalled()
      expect($router.push).toBeCalledTimes(1)
      done()
    }, 300)
  })
})

describe('views/NewScript.vue', () => {
  let actions
  let store
  let wrapper
  let $router

  beforeEach(() => {
    $router = {
      push: jest.fn()
    }
    actions = {
      newParametersAndScripts: jest.fn().mockRejectedValue({}),
      addParameters: jest.fn().mockResolvedValue({}),
      editScript: jest.fn().mockResolvedValue({})
    }
    store = new Vuex.Store({
      state: {
        scripts: schemas.Script,
        scriptTypes: schemas.ScriptType,
        loaded: true
      },
      actions
    })
    wrapper = shallowMount(NewScript, {
      store,
      localVue,
      mocks: {
        $router
      },
      stubs: ['font-awesome-icon']
    })
  })

  it('show an error on failed submit', (done) => {
    const form = { nameChanged: false, form: { name: 'UniqueName2', content: 'script' } }
    wrapper.setData(form)
    wrapper.vm.onSubmit()
    setTimeout(() => {
      expect(actions.newParametersAndScripts).toHaveBeenCalled()
      expect(wrapper.vm.showValidationError).toBeTruthy()
      done()
    }, 300)
  })
})
