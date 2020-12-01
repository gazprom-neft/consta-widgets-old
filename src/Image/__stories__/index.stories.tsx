import React from 'react'

import { Text } from '@consta/uikit/Text'
import { text } from '@storybook/addon-knobs'
import { withSmartKnobs } from 'storybook-addon-smart-knobs'

import { createMetadata, createStory } from '@/_private/storybook'
import { Image } from '@/Image'

import docs from './docs.mdx'

export const Interactive = createStory(() => (
  <Image src="https://images.pexels.com/photos/414612/pexels-photo-414612.jpeg" />
))

export const WithTitle = createStory(
  () => (
    <Image
      src="https://images.pexels.com/photos/414612/pexels-photo-414612.jpeg"
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
  title: 'components/Image',

  decorators: [withSmartKnobs({ ignoreProps: ['title'] })],
  parameters: {
    docs: {
      page: docs,
    },
    environment: {
      scaling: false,
      style: {
        width: 250,
        height: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
    },
  },
})
