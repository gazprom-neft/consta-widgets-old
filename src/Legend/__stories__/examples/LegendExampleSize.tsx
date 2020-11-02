import React from 'react'

import { Example } from '@/_private/storybook'

import { Legend } from '../..'

export const LegendExampleSize = () => (
  <Example>
    <Legend
      fontSize="xs"
      direction="column"
      data={[
        {
          color: 'var(--color-bg-alert)',
          text: 'Надпись XS',
        },
      ]}
      labelType="dot"
      labelPosition="left"
    />
    <Legend
      fontSize="s"
      direction="column"
      data={[
        {
          color: 'var(--color-bg-alert)',
          text: 'Надпись S',
        },
      ]}
      labelType="dot"
      labelPosition="left"
    />
    <Legend
      fontSize="m"
      direction="column"
      data={[
        {
          color: 'var(--color-bg-alert)',
          text: 'Надпись M',
        },
      ]}
      labelType="dot"
      labelPosition="left"
    />
  </Example>
)
