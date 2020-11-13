import React from 'react'

import { Text } from '@consta/uikit/Text'
import { object, select, text } from '@storybook/addon-knobs'
import { withSmartKnobs } from 'storybook-addon-smart-knobs'

import { unitPositions } from '@/_private/components/BarChart'
import { createMetadata, createStory } from '@/_private/storybook'

import { MultiBarChart } from '..'
import { interactiveData, withPercentColumnsData, withTwoColumnsData } from '../data.mock'

import docs from './docs.mdx'

const getCommonProps = (initialUnit: string) => {
  const unit = text('unit', initialUnit)
  const unitPosition = select('unitPosition', unitPositions, 'none')

  return {
    gridTicks: 4,
    valuesTicks: 1,
    unit,
    unitPosition,
    isHorizontal: false,
    withScroll: false,
    formatValueForTooltip: (v: number) => `${v} ${unit}`,
  } as const
}

export const Interactive = createStory(
  () => <MultiBarChart {...getCommonProps(interactiveData.unit)} groups={interactiveData.groups} />,
  { name: 'с одним столбцом' }
)

export const WithTwoColumns = createStory(
  () => (
    <MultiBarChart
      {...getCommonProps(withTwoColumnsData.unit)}
      groups={withTwoColumnsData.groups}
    />
  ),
  { name: 'с двумя столбцами' }
)

export const HasRatio = createStory(
  () => (
    <MultiBarChart
      {...getCommonProps(withTwoColumnsData.unit)}
      groups={withPercentColumnsData.groups}
      formatValueForLabel={v => `${v}%`}
    />
  ),
  { name: 'в процентах' }
)

export const Minimalistic = createStory(
  () => (
    <MultiBarChart
      {...getCommonProps(interactiveData.unit)}
      groups={interactiveData.groups}
      gridTicks={0}
      valuesTicks={0}
      isHorizontal={true}
    />
  ),
  { name: 'минималистичный' }
)

export const WithThreshold = createStory(
  () => (
    <MultiBarChart
      {...getCommonProps(interactiveData.unit)}
      groups={interactiveData.groups}
      threshold={object('threshold', interactiveData.threshold)}
    />
  ),
  { name: 'с предельным значением' }
)

export const WithTitle = createStory(
  () => {
    return (
      <MultiBarChart
        {...getCommonProps(interactiveData.unit)}
        groups={interactiveData.groups}
        title={
          <Text as="div" view="primary" size="m">
            {text('title', 'Заголовок')}
          </Text>
        }
      />
    )
  },
  {
    name: 'с заголовком',
  }
)

export default createMetadata({
  title: 'components/MultiBarChart',
  decorators: [withSmartKnobs({ ignoreProps: ['title'] })],
  parameters: {
    docs: {
      page: docs,
    },
    environment: { style: { width: '60vw', height: '80vh' } },
  },
})
