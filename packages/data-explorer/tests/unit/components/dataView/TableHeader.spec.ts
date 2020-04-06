import { shallowMount } from '@vue/test-utils'
import TableHeader from '@/components/dataView/TableHeader.vue'

describe('TableHeader.vue', () => {
  it('exists', () => {
    const wrapper = shallowMount(TableHeader, { propsData: { visibleColumns: [] } })
    expect(wrapper.exists()).toBeTruthy()
  })
  it('renders table headers', () => {
    const wrapper = shallowMount(TableHeader, { propsData: { visibleColumns: ['1', '2', '3'] } })
    expect(wrapper.findAll('th').length).toEqual(3)
  })
})
