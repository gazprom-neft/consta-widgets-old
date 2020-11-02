import React from 'react'

import { Example } from '@/_private/storybook'

import { Legend } from '../..'

export const LegendExampleText = () => (
  <Example>
    <Legend
      direction="column"
      data={[
        {
          color: 'var(--color-bg-alert)',
          text: 'Эта линия красивая красная',
        },
        {
          color: 'var(--color-bg-normal)',
          text: 'Эта линия красивая синяя',
        },
        {
          color: 'var(--color-bg-warning)',
          text: 'Эта линия — вообще супер, и, кстати, она желтая',
        },
        {
          color: 'var(--color-bg-success)',
          text: 'Эта линия зеленая',
        },
      ]}
      labelType="dot"
      fontSize="s"
      labelPosition="left"
    />
  </Example>
)
