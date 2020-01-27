import { shallowMount } from '@vue/test-utils'
import TableRow from '@/components/dataView/TableRow.vue'

describe('EntityTableRow.vue', () => {
  it('exists', () => {
    const wrapper = shallowMount(TableRow, { propsData: { id: 'id', rowData: {} } })
    expect(wrapper.exists()).toBeTruthy()
  })
  it('renders table rows', () => {
    const wrapper = shallowMount(TableRow, { propsData: { id: 'id', rowData: { name: 'name', title: 'title', content: 'content' } } })
    expect(wrapper.findAll('td').length).toEqual(3)
  })
})
