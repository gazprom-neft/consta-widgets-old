import React from 'react'

import { action } from '@storybook/addon-actions'
import { withSmartKnobs } from 'storybook-addon-smart-knobs'

import { createMetadata, createStory } from '@/_private/storybook'

import { ImagesList } from '..'
import { images } from '../data.mock'

import docs from './docs.mdx'

export const Interactive = createStory(() => (
  <ImagesList images={images} onClick={action('onClick')} />
))

export default createMetadata({
  title: 'components/ImagesList',
  decorators: [withSmartKnobs()],
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
