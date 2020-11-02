import React from 'react'

import { Example } from '@/_private/storybook'

import { Stats } from '../..'

const data = {
  title: 'Заголовок',
  value: 146,
  badge: {
    percentage: 100,
    status: 'normal',
  },
  unit: 'единицы',
  size: 'xs',
} as const

export const StatsExampleLayoutFull = () => (
  <Example>
    <Stats {...data} layout="full" />
  </Example>
)

export const StatsExampleLayoutFullWithoutTitle = () => (
  <Example>
    <Stats {...data} layout="full-without-title" />
  </Example>
)

export const StatsExampleLayoutFullReversed = () => (
  <Example>
    <Stats {...data} layout="full-reversed" />
  </Example>
)

export const StatsExampleLayoutCompactTitle = () => (
  <Example>
    <Stats {...data} layout="compact-title" />
  </Example>
)

export const StatsExampleLayoutCompactUnit = () => (
  <Example>
    <Stats {...data} layout="compact-unit" />
  </Example>
)
