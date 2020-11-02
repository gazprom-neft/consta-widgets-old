import React from 'react'

import { Example } from '@/_private/storybook'

import { Stats } from '../..'

const data = {
  title: '',
  value: 146,
  badge: {
    percentage: 100,
    status: 'normal',
  },
  unit: 'единицы',
  layout: 'full',
} as const

export const StatsExampleSize2XS = () => (
  <Example>
    <Stats {...data} size="2xs" />
  </Example>
)

export const StatsExampleSizeXS = () => (
  <Example>
    <Stats {...data} size="xs" />
  </Example>
)

export const StatsExampleSizeS = () => (
  <Example>
    <Stats {...data} size="s" />
  </Example>
)

export const StatsExampleSizeM = () => (
  <Example>
    <Stats {...data} size="m" />
  </Example>
)

export const StatsExampleSizeL = () => (
  <Example>
    <Stats {...data} size="l" />
  </Example>
)
