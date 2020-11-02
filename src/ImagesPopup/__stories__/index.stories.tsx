import React from 'react'

import { action } from '@storybook/addon-actions'
import { withSmartKnobs } from 'storybook-addon-smart-knobs'

import { createMetadata, createStory } from '@/_private/storybook'

import { ImagesPopup } from '..'

import docs from './docs.mdx'

export const Interactive = createStory(() => (
  <ImagesPopup
    images={[
      { large: 'https://images.pexels.com/photos/414612/pexels-photo-414612.jpeg' },
      { preview: 'https://via.placeholder.com/150', large: 'https://via.placeholder.com/1500' },
      { large: 'https://via.placeholder.com/400x200' },
      { large: 'https://via.placeholder.com/200x400' },
    ]}
    openOnImage={1}
    onRequestClose={action('onRequestClose')}
  />
))

export default createMetadata({
  title: 'components/ImagesPopup',
  decorators: [withSmartKnobs()],
  parameters: {
    docs: {
      page: docs,
    },
    environment: { scaling: false },
  },
})
