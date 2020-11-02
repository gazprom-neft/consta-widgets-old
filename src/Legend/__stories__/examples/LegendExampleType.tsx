import React from 'react'

import { Example } from '@/_private/storybook'

import { Legend } from '../..'

export const LegendExampleType = () => (
  <Example>
    <Legend
      direction="column"
      labelType="dot"
      data={[
        {
          color: 'var(--color-bg-normal)',
          text: 'Маркер dot',
        },
      ]}
      fontSize="s"
      labelPosition="left"
    />
    <Legend
      direction="column"
      labelType="line"
      data={[
        {
          color: 'var(--color-bg-normal)',
          text: 'Маркер line',
        },
      ]}
      fontSize="s"
      labelPosition="left"
    />
    <Legend
      direction="column"
      labelType="warning"
      data={[
        {
          color: 'var(--color-bg-normal)',
          text: 'Маркер warning',
        },
      ]}
      fontSize="s"
      labelPosition="left"
    />
  </Example>
)

export const LegendExampleTypeLine = () => (
  <Example>
    <Legend
      direction="column"
      labelType="line"
      data={[
        {
          color: 'var(--color-bg-success)',
          text: 'Маркер line',
        },
      ]}
      fontSize="s"
      labelPosition="left"
    />
    <Legend
      direction="column"
      labelType="line"
      lineBold
      data={[
        {
          color: 'var(--color-bg-success',
          text: 'Маркер с lineBold',
        },
      ]}
      fontSize="s"
      labelPosition="left"
    />
    <Legend
      direction="column"
      labelType="line"
      labelPosition="top"
      data={[
        {
          color: 'var(--color-bg-success)',
          text: 'Маркер в позиции top',
        },
      ]}
      fontSize="s"
    />
  </Example>
)
