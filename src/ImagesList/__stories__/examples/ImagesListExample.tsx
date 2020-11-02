import React from 'react'

import { action } from '@storybook/addon-actions'

import { Example } from '@/_private/storybook'

import { ImagesList } from '../..'
import { images } from '../../data.mock'

export const ImagesListExample = () => (
  <Example>
    <ImagesList images={images} onClick={action('onClick')} />
  </Example>
)

export const ImagesListExampleActive = () => (
  <Example>
    <ImagesList images={images} onClick={action('onClick')} activeItem={0} />
  </Example>
)
