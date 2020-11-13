import React from 'react'

import { Example } from '@/_private/storybook'

import { MultiBarChart } from '../..'
import { interactiveData, withTwoColumnsData } from '../../data.mock'

export const MultiBarChartExampleMin = () => (
  <Example>
    <MultiBarChart gridTicks={4} valuesTicks={1} groups={interactiveData.groups} />
  </Example>
)

export const MultiBarChartExampleSlanted = () => (
  <Example>
    <MultiBarChart
      gridTicks={4}
      valuesTicks={1}
      groups={interactiveData.groups}
      isHorizontal={false}
      isXAxisLabelsSlanted
    />
  </Example>
)

export const MultiBarChartShowValues = () => (
  <Example>
    <MultiBarChart
      gridTicks={4}
      valuesTicks={1}
      groups={interactiveData.groups}
      isHorizontal={false}
      showValues
    />
  </Example>
)

export const MultiBarChartTwoColumns = () => (
  <Example>
    <MultiBarChart
      gridTicks={4}
      valuesTicks={1}
      groups={withTwoColumnsData.groups}
      isHorizontal={false}
      showValues
    />
  </Example>
)

export const MultiBarChartTicks = () => (
  <Example>
    <MultiBarChart
      groups={interactiveData.groups}
      isHorizontal={false}
      showValues
      gridTicks={5}
      valuesTicks={2}
      formatValueForLabel={v => `${v} %`}
    />
  </Example>
)

export const MultiBarChartTicks2 = () => (
  <Example>
    <MultiBarChart
      groups={interactiveData.groups}
      isHorizontal={false}
      showValues
      gridTicks={10}
      valuesTicks={2}
    />
  </Example>
)

export const MultiBarChartTooltip = () => (
  <Example>
    <MultiBarChart
      gridTicks={4}
      valuesTicks={1}
      groups={withTwoColumnsData.groups}
      isHorizontal={false}
      showValues
      formatValueForLabel={v => `${v} тыс.`}
      formatValueForTooltip={v => `${v} тысяч`}
    />
  </Example>
)

export const MultiBarChartExampleThreshold = () => (
  <Example>
    <MultiBarChart
      gridTicks={4}
      valuesTicks={1}
      groups={withTwoColumnsData.groups}
      isHorizontal={false}
      showValues
      threshold={interactiveData.threshold}
    />
  </Example>
)

export const MultiBarChartExampleS = () => (
  <Example width="300px">
    <MultiBarChart
      gridTicks={4}
      valuesTicks={1}
      groups={withTwoColumnsData.groups}
      isHorizontal={true}
      size="s"
    />
  </Example>
)

export const MultiBarChartExampleM = () => (
  <Example width="300px">
    <MultiBarChart
      gridTicks={4}
      valuesTicks={1}
      groups={withTwoColumnsData.groups}
      isHorizontal={true}
      size="m"
    />
  </Example>
)

export const MultiBarChartExampleHorizontal = () => (
  <Example width="300px">
    <MultiBarChart gridTicks={4} valuesTicks={1} groups={withTwoColumnsData.groups} size="m" />
  </Example>
)

export const MultiBarChartUnitsLeft = () => (
  <Example width="300px">
    <MultiBarChart
      gridTicks={4}
      valuesTicks={1}
      groups={withTwoColumnsData.groups}
      unit="тыс. м"
      unitPosition="left"
    />
  </Example>
)

export const MultiBarChartUnitsBottom = () => (
  <Example width="300px">
    <MultiBarChart
      gridTicks={4}
      valuesTicks={1}
      groups={withTwoColumnsData.groups}
      unit="тыс. м"
      unitPosition="bottom"
    />
  </Example>
)

export const MultiBarChartUnitsLeftBottom = () => (
  <Example width="300px">
    <MultiBarChart
      gridTicks={4}
      valuesTicks={1}
      groups={withTwoColumnsData.groups}
      unit="тыс. м"
      unitPosition="left-and-bottom"
    />
  </Example>
)

export const MultiBarChartUnitsNone = () => (
  <Example width="300px">
    <MultiBarChart
      gridTicks={4}
      valuesTicks={1}
      groups={withTwoColumnsData.groups}
      unit="тыс. м"
      unitPosition="none"
    />
  </Example>
)

export const MultiBarChartExampleScroll = () => (
  <Example height="50px">
    <MultiBarChart
      gridTicks={4}
      valuesTicks={1}
      groups={withTwoColumnsData.groups}
      isHorizontal={true}
      size="m"
      withScroll={true}
    />
  </Example>
)
