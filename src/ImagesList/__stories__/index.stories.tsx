import React from 'react'

import { Text } from '@consta/uikit/Text'
import { action } from '@storybook/addon-actions'
import { text } from '@storybook/addon-knobs'
import { withSmartKnobs } from 'storybook-addon-smart-knobs'

import { createMetadata, createStory } from '@/_private/storybook'

import { ImagesList } from '..'
import { images } from '../data.mock'

import docs from './docs.mdx'

export const Interactive = createStory(() => (
  <ImagesList images={images} onClick={action('onClick')} />
))

export const WithTitle = createStory(
  () => (
    <ImagesList
      images={images}
      title={
        <Text as="div" view="primary" size="m">
          {text('title', 'Заголовок')}
        </Text>
      }
      onClick={action('onClick')}
    />
  ),
  { name: 'с заголовком' }
)

export default createMetadata({
  title: 'components/ImagesList',
  decorators: [withSmartKnobs({ ignoreProps: ['title'] })],
  parameters: {
    docs: {
      page: docs,
    },
    environment: {
      style: {
        width: '20vw',
      },
    },
  },
})
