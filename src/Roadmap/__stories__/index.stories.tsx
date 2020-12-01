import React from 'react'

import { Text } from '@consta/uikit/Text'
import { object, text } from '@storybook/addon-knobs'
import { withSmartKnobs } from 'storybook-addon-smart-knobs'

import { createMetadata, createStory } from '@/_private/storybook'

import { Roadmap } from '..'
import { data, minimalData, monochromeData } from '../data.mock'

import docs from './docs.mdx'

export const Interactive = createStory(() => {
  const { columns, rows, currentDay, startDate, endDate, filters } = data

  return (
    <Roadmap
      rows={object('rows', rows)}
      columns={object('columns', columns)}
      filters={object('filters', filters)}
      startDate={startDate}
      currentDay={currentDay}
      endDate={endDate}
    />
  )
})

export const WithLittleData = createStory(
  () => {
    const { columns, currentDay, rows, startDate, endDate, filters } = minimalData

    return (
      <Roadmap
        rows={object('rows', rows)}
        columns={object('columns', columns)}
        filters={object('filters', filters)}
        startDate={startDate}
        currentDay={currentDay}
        endDate={endDate}
      />
    )
  },
  { name: 'с малым количеством данных' }
)

export const SingleColor = createStory(
  () => {
    const { columns, currentDay, rows, startDate, endDate, filters } = monochromeData

    return (
      <Roadmap
        rows={object('rows', rows)}
        columns={object('columns', columns)}
        filters={object('filters', filters)}
        startDate={startDate}
        currentDay={currentDay}
        endDate={endDate}
      />
    )
  },
  { name: 'одноцветный' }
)

export const WithTitle = createStory(
  () => {
    const { columns, rows, currentDay, startDate, endDate, filters } = data

    return (
      <Roadmap
        rows={object('rows', rows)}
        columns={object('columns', columns)}
        filters={object('filters', filters)}
        startDate={startDate}
        currentDay={currentDay}
        endDate={endDate}
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
  title: 'components/Roadmap',
  decorators: [withSmartKnobs({ ignoreProps: ['title'] })],
  parameters: {
    docs: {
      page: docs,
    },
    environment: {
      style: {
        width: '80vw',
        height: '80vh',
      },
    },
  },
})
