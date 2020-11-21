import React from 'react'

import { Example } from '@/_private/storybook'

import { RadarChart } from '../..'
import {
  axesLabelsExample,
  figuresExample,
  figuresExampleCheb,
  figuresExampleChebNull,
} from '../../data.mock'

export const RadarChartExample = () => (
  <Example>
    <RadarChart
      axesLabels={axesLabelsExample}
      maxValue={10}
      figures={figuresExample}
      ticks={4}
      backgroundColor="var(--color-bg-default)"
      withConcentricColor={false}
      labelSize="s"
    />
  </Example>
)

export const RadarChartExampleTicks5 = () => (
  <Example>
    <RadarChart
      axesLabels={axesLabelsExample}
      maxValue={10}
      figures={figuresExample}
      ticks={5}
      backgroundColor="var(--color-bg-default)"
      withConcentricColor={false}
      labelSize="s"
    />
  </Example>
)

export const RadarChartExampleTicks10 = () => (
  <Example>
    <RadarChart
      axesLabels={axesLabelsExample}
      maxValue={10}
      figures={figuresExample}
      ticks={10}
      backgroundColor="var(--color-bg-default)"
      withConcentricColor={false}
      labelSize="s"
    />
  </Example>
)

export const RadarChartExampleMaxValue20 = () => (
  <Example>
    <RadarChart
      axesLabels={axesLabelsExample}
      maxValue={20}
      figures={figuresExample}
      ticks={5}
      backgroundColor="var(--color-bg-default)"
      withConcentricColor={false}
      labelSize="s"
    />
  </Example>
)

export const RadarChartExampleFormatValueForLable = () => (
  <Example>
    <RadarChart
      axesLabels={axesLabelsExample}
      maxValue={10}
      figures={figuresExample}
      ticks={5}
      backgroundColor="var(--color-bg-default)"
      withConcentricColor={false}
      labelSize="s"
      formatValueForLabel={v => `${v} у. е.`}
    />
  </Example>
)

export const RadarChartExampleFormatValueForTooltip = () => (
  <Example>
    <RadarChart
      axesLabels={axesLabelsExample}
      maxValue={10}
      figures={figuresExample}
      ticks={5}
      backgroundColor="var(--color-bg-default)"
      withConcentricColor={false}
      labelSize="s"
      formatValueForTooltip={v => `${v} у. е.`}
    />
  </Example>
)

export const RadarChartExampleSizeM = () => (
  <Example>
    <RadarChart
      axesLabels={axesLabelsExample}
      maxValue={10}
      figures={figuresExample}
      ticks={5}
      backgroundColor="var(--color-bg-default)"
      withConcentricColor={false}
      labelSize="m"
    />
  </Example>
)

export const RadarChartExampleCheb = () => (
  <Example>
    <RadarChart
      axesLabels={axesLabelsExample}
      maxValue={10}
      figures={figuresExampleCheb}
      ticks={5}
      backgroundColor="var(--color-bg-default)"
      withConcentricColor={false}
      labelSize="s"
    />
  </Example>
)

export const RadarChartExampleChebNull = () => (
  <Example>
    <RadarChart
      axesLabels={axesLabelsExample}
      maxValue={10}
      figures={figuresExampleChebNull}
      ticks={5}
      backgroundColor="var(--color-bg-default)"
      withConcentricColor={false}
      labelSize="s"
    />
  </Example>
)

export const RadarChartExampleRainbow = () => (
  <Example>
    <RadarChart
      axesLabels={axesLabelsExample}
      maxValue={10}
      figures={figuresExample}
      ticks={5}
      backgroundColor="var(--color-bg-default)"
      withConcentricColor={true}
      labelSize="s"
    />
  </Example>
)

export const RadarChartExampleRed = () => (
  <Example>
    <RadarChart
      axesLabels={axesLabelsExample}
      maxValue={10}
      figures={figuresExample}
      ticks={5}
      backgroundColor="red"
      withConcentricColor={false}
      labelSize="s"
    />
  </Example>
)
