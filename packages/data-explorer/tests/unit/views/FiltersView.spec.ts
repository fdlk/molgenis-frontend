import { createLocalVue, shallowMount } from '@vue/test-utils'
import FiltersView from '@/views/FiltersView.vue'
import Vuex from 'vuex'

describe('FiltersView.vue', () => {
  const localVue = createLocalVue()
  localVue.use(Vuex)
  let store: any
  let state: any
  let mutations: any

  beforeEach(() => {
    state = {
      filters: {
        hideSidebar: false,
        definition: [],
        shown: [],
        selections: {}
      }
    }
    mutations = {
      setHideFilters: jest.fn(),
      setFiltersShown: jest.fn()
    }
    store = new Vuex.Store({
      state, mutations
    })
  })

  it('exists', () => {
    const wrapper = shallowMount(FiltersView, { store, localVue })
    expect(wrapper.exists()).toBeTruthy()
  })

  it('show/hides the filters', () => {
    const wrapper = shallowMount(FiltersView, { store, localVue })
    wrapper.find('.hide-filters').trigger('click')
    expect(mutations.setHideFilters.mock.calls.length > 0).toBeTruthy()
  })
})
