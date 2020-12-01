import React from 'react'

import { Text } from '@consta/uikit/Text'
import { text } from '@storybook/addon-knobs'
import { withSmartKnobs } from 'storybook-addon-smart-knobs'

import { createMetadata, createStory } from '@/_private/storybook'

import { DEFAULT_COLORS, PyramidChart } from './'

const data = [
  {
    value: null,
    text: '1. Смертельные на производстве ',
  },
  {
    value: 23,
    text: '2. Уровень 1+Травмы с ВПТ',
  },
  {
    value: null,
    text: '3. Уровень 2+Мед. помощь',
  },
  {
    value: 459,
    text: '4. Первая помощь',
  },
  {
    value: 2950,
    text: '5. Происшествия без последствий',
  },
  {
    value: 12374,
    text: '6. ОД и ОУ ',
  },
]

export const Interactive = createStory(() => (
  <PyramidChart data={data} colors={DEFAULT_COLORS} fontSize="m" constraint />
))

export const WithTitle = createStory(
  () => (
    <PyramidChart
      data={data}
      colors={DEFAULT_COLORS}
      fontSize="m"
      constraint
      title={
        <Text as="div" view="primary" size="m">
          {text('title', 'Заголовок')}
        </Text>
      }
    />
  ),
  { name: 'с заголовком' }
)

export default createMetadata({
  title: 'components/PyramidChart',
  decorators: [withSmartKnobs({ ignoreProps: ['title'] })],
  parameters: {
    environment: {
      style: {
        width: '50vw',
      },
    },
  },
})
