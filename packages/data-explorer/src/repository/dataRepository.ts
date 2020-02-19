// @ts-ignore
import api from '@molgenis/molgenis-api-client'
import { buildExpandedAttributesQuery } from './queryBuilder'
import { getAttributesfromMeta } from './metaDataService'

import { DataApiResponseItem, MetaDataApiResponse, DataApiResponse, DataObject } from '@/types/ApiResponse'
import { StringMap } from '@/types/GeneralTypes'
import { MetaData, Attribute } from '@/types/MetaData'

// maps api response to object with as key the name of the column and as value the label of the value or a list of labels for mrefs
const levelOneRowMapper = (rowData: DataApiResponseItem, metaData: MetaData): StringMap => {
  if (!rowData.data) {
    throw new Error('invalid input: row data must have data property')
  }

  const attributeMap: {[s: string]: Attribute} = metaData.attributes.reduce((accum:any, attr) => {
    accum[attr.name] = attr
    return accum
  }, {})

  const row: DataObject = rowData.data

  let bla = Object.keys(row).reduce((accum, key) => {
    const value = row[key]
    const isReference = attributeMap[key].isReference
    let resolvedValue
    if (isReference) {
      // @ts-ignore
      if (value.items) {
        // The isMref already checks if the value.items is available
        // @ts-ignore
        resolvedValue = value.items.map((mrefValue) => mrefValue.data[attributeMap[key].labelAttribute.name]).join(', ')
      } else {
        // This is checked by isReference
        // @ts-ignore
        resolvedValue = value.data[metaDataRefs[key].labelAttribute.name]
      }
    } else {
      resolvedValue = value
    }
    accum[key] = resolvedValue
    return accum
  }, <StringMap>{})
  return bla
}

const apiResponseMapper = (rowData: DataApiResponseItem) => {
  if (rowData.data) {
    const row: any = rowData.data
    return Object.keys(row).reduce((accum: { [s: string]: string | object }, key) => {
      // check if ref
      if (typeof row[key] === 'object') {
        // This is checked by the line above
        // @ts-ignore
        accum[key] = levelNRowMapper(row[key])
      } else {
        accum[key] = row[key]
      }
      return accum
    }, {})
  }
}

const levelNRowMapper = (rowData: DataApiResponseItem) => {
  // check if mref
  if (rowData.items) {
    const rows: DataApiResponseItem[] = rowData.items
    return rows.map((rowData) => {
      return apiResponseMapper(rowData)
    })
  } else {
    return apiResponseMapper(rowData)
  }
}

const addFilterIfSet = (request: string, rsqlFilter?: string): string => {
  return rsqlFilter ? `${request}&q=${rsqlFilter}` : request
}

const getTableDataDeepReference = async (tableId: string, metaData: MetaData, coloms: string[], rsqlQuery?: string) => {
  if (!coloms.includes(metaData.idAttribute.name)) {
    coloms.push(metaData.idAttribute.name)
  }

  if (metaData.labelAttribute !== undefined && !coloms.includes(metaData.labelAttribute.name)) {
    coloms.push(metaData.labelAttribute.name)
  }

  const expandReferencesQuery = buildExpandedAttributesQuery(metaData, coloms)
  const request = addFilterIfSet(`/api/data/${tableId}?${expandReferencesQuery}`, rsqlQuery)
  const response = await api.get(request)
  response.items = response.items.map((item: DataApiResponseItem) => levelNRowMapper(item))
  return response
}

const getTableDataWithLabel = async (tableId: string, metaData: MetaData, columns: string[], rsqlQuery?: string) => {
  const columnSet = new Set([...columns])
  columnSet.add(metaData.idAttribute.name)
  if (metaData.labelAttribute !== undefined) {
    columnSet.add(metaData.labelAttribute.name)
  }

  const expandReferencesQuery = buildExpandedAttributesQuery(metaData, [...columnSet])
  const request = addFilterIfSet(`/api/data/${tableId}?${expandReferencesQuery}`, rsqlQuery)
  const response = await api.get(request)
  response.items = response.items.map((item: DataApiResponseItem) => levelOneRowMapper(item, metaData))
  return response
}

// called on row expand
const getRowDataWithReferenceLabels = async (tableId: string, rowId: string, metaData: MetaData) => {
  const attributes: string[] = getAttributesfromMeta(metaData)
  // Todo: remove work around, needed as compounds are not pased by getAttributesfromMeta.
  // Addding id and label makes sure we get these fields.
  const columnSet = new Set([...attributes])
  columnSet.add(metaData.idAttribute.name)
  if (metaData.labelAttribute !== undefined) {
    columnSet.add(metaData.labelAttribute.name)
  }
  // const expandReferencesQuery = buildExpandedAttributesQuery(metaData, [...columnSet], true)
  const expandReferencesQuery = buildExpandedAttributesQuery(metaData, [...columnSet])
  const response = await api.get(`/api/data/${tableId}/${rowId}?${expandReferencesQuery}`)
  return levelOneRowMapper(response, metaData)
}

export {
  getTableDataDeepReference,
  getTableDataWithLabel,
  getRowDataWithReferenceLabels
}
