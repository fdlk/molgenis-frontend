// @ts-ignore
import api from '@molgenis/molgenis-api-client'

// Todo placeholder until we have a metadataApi
const fetchMetaData = async (entityId: string) => {
  const resp = await api.get(`/api/v2/${entityId}?num=0`)
  return resp.meta
}

export {
  fetchMetaData
}