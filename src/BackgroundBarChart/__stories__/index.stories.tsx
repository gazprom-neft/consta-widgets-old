import React from 'react'

import { text } from '@storybook/addon-knobs'
import { withSmartKnobs } from 'storybook-addon-smart-knobs'

import { createMetadata, createStory } from '@/_private/storybook'

import { BackgroundBarChart } from '..'
import { groups } from '../data.mock'

import docs from './docs.mdx'

const getCommonProps = (initialUnit: string) => {
  const unit = text('unit', initialUnit)

  return {
    groups,
    gridTicks: 4,
    valuesTicks: 1,
    formatValueForTooltip: (v: number) => `${v} ${unit}`,
    unit,
    align: 'start',
    isHorizontal: true,
    showValues: false,
  } as const
}

export const Interactive = createStory(
  () => {
    return <BackgroundBarChart {...getCommonProps('тыс. м³')} />
  },
  {
    parameters: {
      environment: {
        style: { width: '40vw' },
      },
    },
  }
)

export const WithVerticalScroll = createStory(
  () => {
    return <BackgroundBarChart {...getCommonProps('тыс. м³')} withScroll />
  },
  {
    name: 'С вертикальным скроллом',
    parameters: {
      environment: {
        style: { width: '40vw', height: '250px' },
      },
    },
  }
)

export default createMetadata({
  title: 'components/BackgroundBarChart',
  decorators: [withSmartKnobs()],
  parameters: {
    docs: {
      page: docs,
    },
  },
})
