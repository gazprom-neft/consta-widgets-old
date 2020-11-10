import React from 'react'

import { Example } from '@/_private/storybook'

import { Colors, ProgressDonut } from '../..'

const title = 'факт/план ПП'

const data = {
  value: 30,
  valueMin: 0,
  valueMax: 100,
}

const data120 = {
  value: 120,
  valueMin: 0,
  valueMax: 100,
}

const colors: Colors = ['var(--color-bg-normal)', 'var(--color-bg-success)']

export const ProgressDonutExample = () => (
  <Example height="150px">
    <ProgressDonut title={title} data={data} colors={colors} showText showTitle />
  </Example>
)

export const ProgressDonut120 = () => (
  <Example height="150px">
    <ProgressDonut title={title} data={data120} colors={colors} />
  </Example>
)

export const ProgressDonutText120 = () => (
  <Example height="150px">
    <ProgressDonut title={title} data={data120} colors={colors} showText />
  </Example>
)

export const ProgressDonutMin = () => (
  <Example height="150px">
    <ProgressDonut
      title="Заголовок"
      colors={['var(--color-bg-normal)', 'var(--color-bg-success)']}
    />
  </Example>
)

export const ProgressDonutMinData = () => (
  <Example height="150px">
    <ProgressDonut
      title="Заголовок"
      colors={['var(--color-bg-normal)', 'var(--color-bg-success)']}
      data={data}
    />
  </Example>
)

export const ProgressDonutText = () => (
  <Example height="150px">
    <ProgressDonut
      title="Заголовок"
      colors={['var(--color-bg-normal)', 'var(--color-bg-success)']}
      data={data}
      showText
    />
  </Example>
)

export const ProgressDonutText45 = () => (
  <Example height="150px">
    <ProgressDonut
      title="Заголовок"
      colors={['var(--color-bg-normal)', 'var(--color-bg-success)']}
      data={data}
      showText
      valueSize={10}
    />
  </Example>
)

export const ProgressDonutTitle = () => (
  <Example height="150px">
    <ProgressDonut
      title="Заголовок"
      colors={['var(--color-bg-normal)', 'var(--color-bg-success)']}
      data={data}
      showText
      showTitle
    />
  </Example>
)

export const ProgressDonutTop = () => (
  <Example>
    <ProgressDonut title={title} data={data} colors={colors} showText showTitle halfDonut="top" />
  </Example>
)

export const ProgressDonutBottom = () => (
  <Example>
    <ProgressDonut
      title={title}
      data={data}
      colors={colors}
      showText
      showTitle
      halfDonut="bottom"
    />
  </Example>
)

export const ProgressDonutLeft = () => (
  <Example height="150px">
    <ProgressDonut title={title} data={data} colors={colors} showText showTitle halfDonut="left" />
  </Example>
)

export const ProgressDonutRight = () => (
  <Example height="150px">
    <ProgressDonut title={title} data={data} colors={colors} showText showTitle halfDonut="right" />
  </Example>
)
