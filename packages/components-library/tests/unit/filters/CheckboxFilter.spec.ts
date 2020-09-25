import { createLocalVue, mount } from '@vue/test-utils'
import { BootstrapVue } from 'bootstrap-vue'
import CheckboxFilter from '@/components/filters/CheckboxFilter.vue'
const localVue = createLocalVue()
localVue.use(BootstrapVue)

function getWrapper (props = {}) {
  const propsData = {
    ...props,
    value: [],
    options: async () => {
      return [
        { value: 'foo', text: 'Foo' },
        { value: 'bar', text: 'Bar' },
        { value: 'baz', text: 'Baz' }
      ]
    }
  }

  const wrapper = mount(CheckboxFilter, {
    localVue,
    stubs: ['font-awesome-icon'],
    propsData,
    listeners: {
      input: (newVal: any) => {
        wrapper.setProps({ value: newVal })
      }
    }
  })
  return wrapper
}

describe('CheckboxFilter.vue', () => {
  describe('Parsing only required props', () => {
    let wrapper: any
    beforeEach(() => { wrapper = getWrapper() })

    it('matches the snapshot', () => {
      expect(wrapper.element).toMatchSnapshot()
    })

    it('can set and unset values', async () => {
      const inputElements = wrapper.findAll('input')
      inputElements.at(0).trigger('click') // select foo
      inputElements.at(1).trigger('click') // select bar
      inputElements.at(2).trigger('click') // select baz
      inputElements.at(1).trigger('click') // deselect bar
      await localVue.nextTick()
      expect(wrapper.emitted('input')[0]).toEqual([['foo', 'baz']])
    })

    it('can select all and deselect all', async () => {
      const toggleSelect = wrapper.find('.toggle-select')
      expect(toggleSelect.text()).toBe('Select all')
      await toggleSelect.trigger('click') // select all
      expect(toggleSelect.text()).toBe('Deselect all')
      expect(wrapper.findAll('input[type=checkbox]:checked').length).toEqual(3)
      await toggleSelect.trigger('click') // deselect all
      expect(wrapper.findAll('input[type=checkbox]:checked').length).toEqual(0)
    })
  })

  describe('When restricting maxVisibleOptions to 1', () => {
    let wrapper: any
    beforeEach(() => { wrapper = getWrapper({ maxVisibleOptions: 1 }) })

    it('can hide elements based on maxVisibleOptions', async () => {
      expect(wrapper.findAll('input[type=checkbox]').length).toBe(1)

      const sliceButton = wrapper.find('.toggle-slice')
      await sliceButton.trigger('click')
      expect(wrapper.findAll('input[type=checkbox]').length).toBe(3)
      await sliceButton.trigger('click')
      expect(wrapper.findAll('input[type=checkbox]').length).toBe(1)
    })
  })
})
