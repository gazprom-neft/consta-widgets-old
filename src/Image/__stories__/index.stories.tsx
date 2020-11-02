import React from 'react'

import { withSmartKnobs } from 'storybook-addon-smart-knobs'

import { createMetadata, createStory } from '@/_private/storybook'
import { Image } from '@/Image'

import docs from './docs.mdx'

export const Interactive = createStory(() => (
  <Image src="https://images.pexels.com/photos/414612/pexels-photo-414612.jpeg" />
))

export default createMetadata({
  title: 'components/Image',

  decorators: [withSmartKnobs()],
  parameters: {
    docs: {
      page: docs,
    },
    environment: {
      scaling: false,
      style: {
        width: 600,
        height: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
    },
  },
})
