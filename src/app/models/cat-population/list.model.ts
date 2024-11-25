export interface ListItemObject {
  id: string
  borderBottom: boolean
  isTitle: boolean
  isTitleLeft: boolean
  isNumber: boolean
  value: string
}

export interface FormatedPopulationData {
  id: string
  year: string
  rows: ListItemObject[][]
}
