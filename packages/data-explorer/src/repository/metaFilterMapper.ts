// @ts-ignore
import api from '@molgenis/molgenis-api-client'
import { MetaDataApiResponse } from '@/types/ApiResponse'

const mapMetaToFilters = async (meta: MetaDataApiResponse) => {
  let shownFilters:string[] = []

  // TODO: map all filters
  const categoricals = await Promise.all(meta.attributes.filter(item => item.fieldType.includes('CATEGORICAL')).map(async (item) => {
    const href = item && item.refEntity && item.refEntity.href

    if (!href) return

    const options = await getOptions(href)
    shownFilters.push(item.name)

    return {
      name: item.name,
      label: item.label,
      type: 'checkbox-filter',
      options: options,
      collapsable: true,
      collapsed: false
    }
  }))

  return {
    definition: categoricals,
    shown: shownFilters
  }
}

const getOptions = async (href: string) => {
  const resp = await api.get(href)
  console.log()

  return resp.items.map((item: any) => ({ value: item.id, text: item[resp.meta.labelAttribute] }))
}

export {
  mapMetaToFilters
}
