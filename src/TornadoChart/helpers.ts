import { isDefined, isNotNil } from '@consta/widgets-utils/lib/type-guards'
import _ from 'lodash'

import { ShowPositions } from '@/_private/components/BarChart/helpers'
import { FormatValue } from '@/_private/types'

import { Column, Group, XAxisShowPosition, YAxisShowPosition } from './'

export const getFormatter = (formatter?: FormatValue): FormatValue => value => {
  const positiveValue = Math.abs(value)

  return formatter ? formatter(positiveValue) : String(positiveValue)
}

export const getAxisShowPositions = (x: XAxisShowPosition, y: YAxisShowPosition): ShowPositions => {
  return {
    left: y === 'left' || y === 'both',
    right: y === 'right' || y === 'both',
    top: x === 'top' || x === 'both',
    bottom: x === 'bottom' || x === 'both',
  }
}

const getTransformColumn = (
  colors: readonly [string, string],
  filter: (index: number) => boolean
) => (column: Column, columnIdx: number) => {
  const sections = isNotNil(column)
    ? [
        {
          color: colors[columnIdx],
          value: column,
        },
      ]
    : []

  return filter(columnIdx)
    ? {
        total: column || 0,
        sections,
      }
    : undefined
}

export const transformGroupsToCommonGroups = (
  groups: readonly Group[],
  colors: readonly [string, string]
) => {
  const getColumns = getTransformColumn(colors, i => i % 2 !== 0)
  const getReversedColumns = getTransformColumn(colors, i => i % 2 === 0)

  return _.orderBy(
    groups.map(group => {
      const total = _.sum(group.values.flatMap(column => column))
      const columns = group.values.map(getColumns).filter(isDefined)
      const reversedColumns = group.values.map(getReversedColumns).filter(isDefined)

      return {
        name: group.groupName,
        total,
        columns,
        reversedColumns,
      }
    }),
    g => g.total,
    'desc'
  )
}
