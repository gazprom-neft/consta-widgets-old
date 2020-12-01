import React from 'react'

import { Text } from '@consta/uikit/Text'
import { action } from '@storybook/addon-actions'
import { boolean, object, select, text } from '@storybook/addon-knobs'

import { createMetadata, createStory } from '@/_private/storybook'
import { labelPositions, labelTypes, sizes } from '@/LegendItem'
import { LinearChart } from '@/LinearChart'

import { directions, Legend } from '..'
import { interactiveData, withChart } from '../data.mock'

import docs from './docs.mdx'

const getCommonProps = () =>
  ({
    direction: select('direction', directions, 'column'),
    labelPosition: select('labelPosition', labelPositions, labelPositions[1]),
    labelType: select('labelType', labelTypes, labelTypes[0]),
    fontSize: select('fontSize', sizes, sizes[1]),
    lineBold: boolean('lineBold', false),
  } as const)

export const Interactive = createStory(
  () => <Legend {...getCommonProps()} data={object('data', interactiveData)} />,
  {
    parameters: {
      environment: {
        style: {
          width: 200,
        },
      },
    },
  }
)

export const WithChart = createStory(
  () => (
    <>
      <div style={{ height: 200, marginBottom: 'var(--space-m)' }}>
        <LinearChart {...withChart.linearChartProps} />
      </div>
      <div style={{ display: 'inline-block' }}>
        <Legend
          {...getCommonProps()}
          data={object('data', withChart.data)}
          onItemMouseEnter={action('onItemMouseEnter')}
          onItemMouseLeave={action('onItemMouseLeave')}
        />
      </div>
    </>
  ),
  {
    name: 'с графиком',
    parameters: {
      environment: {
        style: {
          width: 400,
        },
      },
    },
  }
)

export const WithTitle = createStory(
  () => (
    <Legend
      {...getCommonProps()}
      data={object('data', interactiveData)}
      title={
        <Text as="div" view="primary" size="m">
          {text('title', 'Заголовок')}
        </Text>
      }
    />
  ),
  {
    name: 'с заголовком',
  }
)

export default createMetadata({
  title: 'components/Legend',
  parameters: {
    docs: {
      page: docs,
    },
  },
})
