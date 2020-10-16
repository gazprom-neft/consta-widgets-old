import React from 'react'

import { CoreBarChart, Threshold, UnitPosition } from '@/_private/components/BarChart'
import { Ticks } from '@/_private/components/BarChart/components/Ticks'
import { FormatValue } from '@/_private/types'
import { ColumnItem as BaseColumnItem } from '@/MultiBarChart'

import { Group } from './components/Group'
import { getValuesDomain, transformGroupsToCommonGroups } from './helpers'

export type ColumnItem = BaseColumnItem & {
  name?: string
}

export type Column = readonly ColumnItem[]

export type Group = {
  groupName: string
  values: Column
  backgroundValues: Column
  isDisabled?: boolean
}

export const aligns = ['start', 'end'] as const

export type Align = typeof aligns[number]

export type Props = {
  groups: readonly Group[]
  gridTicks: number
  valuesTicks: number
  unit?: string
  unitPosition?: UnitPosition
  showValues?: boolean
  isHorizontal?: boolean
  withScroll?: boolean
  align?: Align
  threshold?: Threshold
  formatValueForLabel?: FormatValue
  formatValueForTooltip?: FormatValue
}

export const BackgroundBarChart: React.FC<Props> = props => {
  const { groups, align = 'start', threshold, ...rest } = props

  const disabledGroups = groups
    .filter(({ isDisabled }) => isDisabled)
    .map(({ groupName }) => groupName)

  const commonGroups = transformGroupsToCommonGroups(groups)
  const groupsDomain = commonGroups.map(g => g.name)
  const valuesDomain = getValuesDomain(groups, threshold)

  return (
    <CoreBarChart
      {...rest}
      size="m"
      groups={commonGroups}
      valuesDomain={valuesDomain}
      groupsDomain={groupsDomain}
      maxColumn={1}
      threshold={threshold && threshold.value >= 0 ? threshold : undefined}
      renderGroup={groupProps => <Group {...groupProps} align={align} />}
      renderGroupsLabels={({ size, ...restTickProps }) => (
        <Ticks {...restTickProps} isLabel size="l" showLine disabledValues={disabledGroups} />
      )}
    />
  )
}
