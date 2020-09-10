import { isDefined, isNotNil } from '@consta/widgets-utils/lib/type-guards'
import _ from 'lodash'

import { Column, Group } from './'

const getTransformColumn = (filter: (value: number) => boolean) => (column: Column) => {
  const total = _.sum(column.map(item => item.value))
  const sections = column
    .map(({ value, color }) => {
      if (!isNotNil(value) || !filter(value)) {
        return
      }

      return {
        color,
        value,
      }
    })
    .filter(isDefined)

  return sections.length > 0
    ? {
        total,
        sections,
      }
    : undefined
}

export const transformGroupsToCommonGroups = (groups: readonly Group[]) => {
  const getColumns = getTransformColumn(v => v >= 0)
  const getReversedColumns = getTransformColumn(v => v < 0)

  return groups.map(group => {
    const total = _.sum(group.values.flatMap(column => column.map(item => item.value)))
    const columns = group.values.map(getColumns)
    const reversedColumns = group.values.map(getReversedColumns)

    return {
      name: group.groupName,
      total,
      columns,
      reversedColumns,
    }
  })
}
