import React from 'react'

import { Button } from '@consta/uikit/Button'

import { Example } from '@/_private/storybook'
import { ImagesList } from '@/ImagesList'

import { ImagesPopup } from '../..'
import { images } from '../../data.mock'

export const ImagesPopupOpenByButton = () => {
  const [openImageIndex, setOpenImageIndex] = React.useState<number>()

  return (
    <Example>
      <Button label="Открыть галерею" onClick={() => setOpenImageIndex(0)} />
      <ImagesPopup
        images={images}
        openOnImage={openImageIndex}
        onRequestClose={() => setOpenImageIndex(undefined)}
      />
    </Example>
  )
}

export const ImagesPopupOpenByImagesList = () => {
  const [openImageIndex, setOpenImageIndex] = React.useState<number>()

  return (
    <Example>
      <ImagesList images={images} onClick={setOpenImageIndex} />
      <ImagesPopup
        images={images}
        openOnImage={openImageIndex}
        onRequestClose={() => setOpenImageIndex(undefined)}
      />
    </Example>
  )
}
