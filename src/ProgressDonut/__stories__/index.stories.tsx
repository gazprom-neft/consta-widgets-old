import React from 'react'

import { object } from '@storybook/addon-knobs'
import { withSmartKnobs } from 'storybook-addon-smart-knobs'

import { HalfDonut, halvesDonut } from '@/_private/components/DonutChart/components/Donut'
import { createMetadata, createStory, optionalSelect } from '@/_private/storybook'
import { Colors, ProgressDonut } from '@/ProgressDonut'

import docs from './docs.mdx'

const halfDonutSelect = (value?: HalfDonut) => optionalSelect('halfDonut', halvesDonut, value)

const title = 'факт/план ПП'

const data = {
  value: 30,
  valueMin: 0,
  valueMax: 100,
}

const colors: Colors = ['var(--color-bg-normal)', 'var(--color-bg-success)']

export const Interactive = createStory(
  () => (
    <ProgressDonut
      title={title}
      data={object('data', data)}
      colors={object('colors', colors)}
      halfDonut={halfDonutSelect()}
    />
  ),
  { name: 'стандартный' }
)

export const WithText = createStory(
  () => (
    <ProgressDonut
      title={title}
      data={object('data', data)}
      colors={object('colors', colors)}
      halfDonut={halfDonutSelect()}
      showText
    />
  ),
  {
    name: 'со значением',
  }
)

export const WithTitle = createStory(
  () => (
    <ProgressDonut
      title={title}
      data={object('data', data)}
      colors={object('colors', colors)}
      halfDonut={halfDonutSelect()}
      showText
      showTitle
    />
  ),
  { name: 'с подписью' }
)

export const WithoutData = createStory(
  () => (
    <ProgressDonut
      title={title}
      data={object('data', { valuePlaceholder: '--' })}
      colors={object('colors', colors)}
      showText
    />
  ),
  {
    name: 'без данных',
  }
)

export const WithMoreThan100 = createStory(
  () => (
    <ProgressDonut
      title={title}
      data={object('data', { value: 120 })}
      colors={object('colors', colors)}
    />
  ),
  { name: 'с более 100%' }
)

export const AsHalfDonut = createStory(
  () => {
    return (
      <ProgressDonut
        data={object('data', { value: 20, valueMax: 60 })}
        colors={['var(--color-bg-warning)', 'var(--color-bg-border)']}
        halfDonut={halfDonutSelect('right')}
        title="всего"
        showText
        showTitle
      />
    )
  },
  { name: 'как полукруг' }
)

export default createMetadata({
  title: 'components/ProgressDonut',

  decorators: [withSmartKnobs()],
  parameters: {
    docs: {
      page: docs,
    },
    environment: {
      style: {
        backgroundColor: 'var(--color-control-bg-default)',
        width: 200,
        height: 200,
      },
    },
  },
})
