import React from 'react'

import { Example } from '@/_private/storybook'

import { BackgroundBarChart } from '../..'
import {
  exampleData,
  groupsAnanasExample,
  groupsExample,
  groupsPotatoExample,
} from '../../data.mock'

export const BackgroundBarChartExample = () => (
  <Example>
    <BackgroundBarChart
      groups={groupsExample}
      gridTicks={4}
      valuesTicks={1}
      isHorizontal={true}
      showValues={false}
      align="start"
      threshold={exampleData.threshold}
    />
  </Example>
)

export const BackgroundBarChartPotatoExample = () => (
  <Example>
    <BackgroundBarChart
      groups={groupsPotatoExample}
      gridTicks={4}
      valuesTicks={1}
      isHorizontal={true}
      showValues={false}
      align="start"
    />
  </Example>
)

export const BackgroundBarChartAnanasExample = () => (
  <Example>
    <BackgroundBarChart
      groups={groupsAnanasExample}
      gridTicks={4}
      valuesTicks={1}
      isHorizontal={true}
      showValues={false}
      align="start"
    />
  </Example>
)

export const BackgroundBarFormatValueForLabel = () => (
  <Example>
    <BackgroundBarChart
      groups={groupsPotatoExample}
      gridTicks={4}
      valuesTicks={1}
      isHorizontal={true}
      showValues={false}
      align="start"
      formatValueForLabel={v => `${v} кг`}
    />
  </Example>
)

export const BackgroundBarChartShowValues = () => (
  <Example>
    <BackgroundBarChart
      groups={groupsPotatoExample}
      gridTicks={4}
      valuesTicks={1}
      isHorizontal={true}
      showValues={true}
      align="start"
    />
  </Example>
)

export const BackgroundBarChartExampleTooltip = () => (
  <Example>
    <BackgroundBarChart
      groups={groupsPotatoExample}
      gridTicks={4}
      valuesTicks={1}
      isHorizontal={true}
      align="start"
      formatValueForLabel={v => `${v} кг`}
      formatValueForTooltip={v => `${v} дыщ`}
    />
  </Example>
)

export const BackgroundBarChartExampleTicks = () => (
  <Example>
    <BackgroundBarChart
      groups={groupsPotatoExample}
      gridTicks={10}
      valuesTicks={1}
      isHorizontal={true}
      align="start"
    />
  </Example>
)

export const BackgroundBarChartExampleTicks2 = () => (
  <Example>
    <BackgroundBarChart
      groups={groupsPotatoExample}
      gridTicks={4}
      valuesTicks={2}
      isHorizontal={true}
      align="start"
    />
  </Example>
)

export const BackgroundBarChartExampleThreshold = () => (
  <Example>
    <BackgroundBarChart
      groups={groupsPotatoExample}
      gridTicks={10}
      valuesTicks={1}
      isHorizontal={true}
      align="start"
      threshold={exampleData.threshold}
    />
  </Example>
)

export const BackgroundBarChartExampleStart = () => (
  <Example width="300px">
    <BackgroundBarChart
      groups={groupsPotatoExample}
      gridTicks={5}
      valuesTicks={1}
      isHorizontal={true}
      align="start"
    />
  </Example>
)

export const BackgroundBarChartExampleEnd = () => (
  <Example width="300px">
    <BackgroundBarChart
      groups={groupsPotatoExample}
      gridTicks={5}
      valuesTicks={1}
      isHorizontal={true}
      align="end"
    />
  </Example>
)

export const BackgroundBarChartExampleVertical = () => (
  <Example width="300px">
    <BackgroundBarChart
      groups={groupsPotatoExample}
      gridTicks={5}
      valuesTicks={1}
      isHorizontal={false}
      align="start"
    />
  </Example>
)

export const BackgroundBarChartExampleUnitLeft = () => (
  <Example width="300px">
    <BackgroundBarChart
      groups={groupsPotatoExample}
      gridTicks={5}
      valuesTicks={1}
      isHorizontal={true}
      align="start"
      unit="кг"
      unitPosition="left"
    />
  </Example>
)

export const BackgroundBarChartExampleUnitNone = () => (
  <Example width="300px">
    <BackgroundBarChart
      groups={groupsPotatoExample}
      gridTicks={5}
      valuesTicks={1}
      isHorizontal={true}
      align="start"
      unit="кг"
      unitPosition="none"
    />
  </Example>
)

export const BackgroundBarChartExampleUnitLeftBottom = () => (
  <Example width="300px">
    <BackgroundBarChart
      groups={groupsPotatoExample}
      gridTicks={5}
      valuesTicks={1}
      isHorizontal={true}
      align="start"
      unit="кг"
      unitPosition="left-and-bottom"
    />
  </Example>
)

export const BackgroundBarChartExampleUnitBottom = () => (
  <Example width="300px">
    <BackgroundBarChart
      groups={groupsPotatoExample}
      gridTicks={5}
      valuesTicks={1}
      isHorizontal={true}
      align="start"
      unit="кг"
      unitPosition="bottom"
    />
  </Example>
)
