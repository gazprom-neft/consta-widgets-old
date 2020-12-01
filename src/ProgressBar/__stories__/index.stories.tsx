import React from 'react'

import { Text } from '@consta/uikit/Text'
import { object, text } from '@storybook/addon-knobs'
import { withSmartKnobs } from 'storybook-addon-smart-knobs'

import { createMetadata, createStory } from '@/_private/storybook'

import { ProgressBar } from '..'
import { convertItemToDataItem, progressBarData, progressBarDataWithNullValue } from '../data.mock'

import docs from './docs.mdx'

export const Interactive = createStory(() => {
  const data = object('data', progressBarData.data).map(convertItemToDataItem)

  return <ProgressBar data={data} size="m" />
})

export const WithoutData = createStory(
  () => {
    const data = object('data', progressBarDataWithNullValue.data).map(convertItemToDataItem)

    return <ProgressBar data={data} size="m" />
  },
  {
    name: 'без данных',
  }
)

export const WithTitle = createStory(
  () => {
    const data = object('data', progressBarData.data).map(convertItemToDataItem)

    return (
      <ProgressBar
        data={data}
        size="m"
        title={
          <Text as="div" view="primary" size="m">
            {text('title', 'Заголовок')}
          </Text>
        }
      />
    )
  },
  { name: 'с заголовком' }
)

export default createMetadata({
  title: 'components/ProgressBar',
  decorators: [withSmartKnobs({ ignoreProps: ['data', 'title'] })],
  parameters: {
    docs: {
      page: docs,
    },
    environment: {
      style: {
        width: 300,
        height: 300,
      },
    },
  },
})
