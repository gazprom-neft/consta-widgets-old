import React from 'react'

import { Text } from '@consta/uikit/Text'
import { getArrayWithRandomInt } from '@consta/widgets-utils/lib/array'
import { isNotNil } from '@consta/widgets-utils/lib/type-guards'
import { boolean, number, object, select, text } from '@storybook/addon-knobs'
import { withSmartKnobs } from 'storybook-addon-smart-knobs'

import { createMetadata, createStory, optionalSelect } from '@/_private/storybook'

import { axes, directionsX, directionsY, LinearChart } from '..'

import docs from './docs.mdx'

const MIN = -2
const MAX = 8
const COUNT_POINTS = 51

const IGNORE_PROPS = ['title', 'directionX', 'directionY'] as const

const colors = {
  first: 'var(--color-bg-success)',
  second: 'var(--color-bg-normal)',
}

const getGridConfig = () =>
  object('gridConfig', {
    x: {
      labels: 'bottom',
      labelTicks: 1,
      gridTicks: 10,
      guide: true,
      withPaddings: false,
    },
    y: {
      labels: 'left',
      labelTicks: 1,
      gridTicks: 4,
      guide: true,
      withPaddings: false,
    },
  } as const)

const getDirectionKnobs = () => ({
  directionX: optionalSelect('directionX', directionsX),
  directionY: optionalSelect('directionY', directionsY),
})

const getCommonProps = () => {
  const now = Date.now()
  const unit = text('unit', 'тыс м3')
  const valueMapper = (y: number, x: number) => ({
    x: now + x * 1000 * 60 * 60 * 24,
    y,
  })

  return {
    ...getDirectionKnobs(),
    lines: [
      {
        values: getArrayWithRandomInt(MIN, MAX, COUNT_POINTS - 1).map(valueMapper),
        dots: true,
        lineName: 'Северный бур',
        withGradient: true,
        color: colors.first,
      },
      {
        values: getArrayWithRandomInt(MIN, MAX, COUNT_POINTS).map(valueMapper),
        lineName: 'Южное месторождение',
        color: colors.second,
      },
    ],
    threshold: object('threshold', {
      max: {
        values: getArrayWithRandomInt(MIN, MAX, COUNT_POINTS).map((_, x) => valueMapper(6, x)),
      },
      min: {
        values: getArrayWithRandomInt(MIN, MAX, COUNT_POINTS).map((_, x) => valueMapper(1, x)),
      },
    }),
    gridConfig: getGridConfig(),
    withZoom: true,
    formatValueForLabel: (v: number) => new Date(v).toLocaleDateString(),
    foematValueForTooltip: (v: number) => `${v} ${unit}`,
    formatValueForTooltipTitle: (v: number) => {
      const title = new Date(v)
        .toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })
        .replace('г.', '')

      return title[0].toUpperCase() + title.slice(1)
    },
    unit,
  }
}

const decorators = [
  withSmartKnobs({
    ignoreProps: IGNORE_PROPS,
  }),
] as const

const parameters = {
  docs: {
    page: docs,
  },
  environment: {
    style: {
      width: '60vw',
      height: '50vh',
    },
  },
} as const

export const Horizontal = createStory(
  () => {
    return <LinearChart {...getCommonProps()} isHorizontal />
  },
  {
    name: 'горизонтальный',
    decorators,
    parameters,
  }
)

export const WithNullData = createStory(
  () => {
    return (
      <LinearChart
        lines={[
          {
            values: [
              { x: 0, y: null },
              { x: 1, y: 1 },
              { x: 2, y: 0 },
              { x: 3, y: null },
              { x: 4, y: null },
              { x: 5, y: 3 },
              { x: 6, y: null },
              { x: 7, y: 1 },
              { x: 8, y: 2 },
              { x: 9, y: null },
            ],
            dots: true,
            lineName: 'Северный бур',
            withGradient: true,
            color: colors.first,
          },
        ]}
        gridConfig={getGridConfig()}
        formatValueForLabel={String}
        isHorizontal
        withZoom
      />
    )
  },
  {
    name: 'с пропусками',
    decorators,
    parameters,
  }
)

export const WithClickHandler = createStory(
  () => {
    return (
      <LinearChart
        {...getCommonProps()}
        isHorizontal
        onClickHoverLine={value => alert(new Date(value))}
      />
    )
  },
  {
    name: 'с обработкой клика',
    decorators,
    parameters,
  }
)

const renderTitle = (defaultText: string = '') => {
  const title = text('title', defaultText)

  return title ? (
    <Text as="div" view="primary" size="m">
      {title}
    </Text>
  ) : null
}

export const WithTitle = createStory(
  () => {
    return <LinearChart {...getCommonProps()} isHorizontal title={renderTitle('LTIF')} />
  },
  {
    name: 'с заголовком',
    decorators,
    parameters,
  }
)

export const WithNumbers = createStory(
  () => {
    const values: ReadonlyArray<{ x: number; y: number }> = [
      { x: 0, y: -1 },
      { x: 1, y: 3 },
      { x: 2, y: 1 },
      { x: 3, y: 4 },
    ]
    const thresholdMin = number('Порог: нижняя грань', -1)
    const thresholdMax = number('Порог: верхняя грань', 4)

    return (
      <LinearChart
        {...getDirectionKnobs()}
        lines={[
          {
            values,
            dots: true,
            lineName: 'Северный бур',
            withGradient: true,
            color: colors.first,
          },
          {
            values: [
              { x: 0, y: -2 },
              { x: 1, y: 4 },
              { x: 2, y: 0 },
              { x: 3, y: 5 },
            ],
            lineName: 'Южное месторождение',
            color: colors.second,
          },
        ]}
        gridConfig={getGridConfig()}
        threshold={
          isNotNil(thresholdMax)
            ? {
                max: {
                  values: values.map(({ x }) => ({ x, y: thresholdMax })),
                },
                min: isNotNil(thresholdMin)
                  ? {
                      values: values.map(({ x }) => ({ x, y: thresholdMin })),
                    }
                  : undefined,
              }
            : undefined
        }
        isHorizontal
      />
    )
  },
  { name: 'с числами по x', decorators, parameters }
)

export const Vertical = createStory(
  () => {
    return <LinearChart {...getCommonProps()} isHorizontal={false} />
  },
  {
    name: 'вертикальный',
    decorators: [withSmartKnobs({ ignoreProps: IGNORE_PROPS })],
    parameters: {
      docs: {
        page: docs,
      },
      environment: {
        style: {
          width: 300,
          height: '80vh',
        },
      },
    },
  }
)

export const WithBoundaries = createStory(
  () => {
    return (
      <LinearChart
        {...getDirectionKnobs()}
        lines={[
          {
            values: [
              { x: 0, y: null },
              { x: 1, y: -10 },
              { x: 2, y: 30 },
              { x: 3, y: 5 },
              { x: 4, y: 25 },
              { x: 5, y: -30 },
              { x: 6, y: 25 },
              { x: 7, y: null },
            ],
            dots: true,
            lineName: 'Южное месторождение',
            color: '#3B4D5B',
          },
          {
            values: [
              { x: 0, y: null },
              { x: 1, y: 50 },
              { x: 2, y: -45 },
              { x: 3, y: 35 },
              { x: 4, y: 35 },
              { x: 5, y: -10 },
              { x: 6, y: 10 },
              { x: 7, y: null },
            ],
            dots: true,
            lineName: 'Северный бур',
            color: 'var(--color-bg-success)',
            withBoundaries: true,
          },
        ]}
        gridConfig={getGridConfig()}
        isHorizontal
        background="linear-gradient(to right, #f54d4d48, transparent)"
        showBoundariesOnAxis={boolean('showBoundariesOnAxis', true)}
        boundariesAxis={select('boundariesAxis', axes, 'y')}
        boundaries={[
          {
            value: [-25, -35],
            color: 'var(--color-bg-caution)',
          },
          {
            value: [-35, -51],
            color: 'var(--color-bg-alert)',
          },
          {
            value: [35, 51],
            color: 'var(--color-bg-alert)',
          },
          {
            value: [25, 35],
            color: 'var(--color-bg-caution)',
          },
          {
            value: [25, -25],
            color: 'var(--color-bg-success)',
          },
        ]}
      />
    )
  },
  { name: 'с лимитами', decorators, parameters }
)

export const WithValueLabels = createStory(
  () => {
    return (
      <LinearChart
        {...getDirectionKnobs()}
        gridConfig={object('gridConfig', {
          x: {
            labels: 'bottom',
            labelTicks: 1,
            gridTicks: 10,
            guide: true,
            withPaddings: true,
          },
          y: {
            labels: 'left',
            labelTicks: 1,
            gridTicks: 4,
            guide: true,
            withPaddings: true,
          },
        } as const)}
        lines={[
          {
            values: [
              { x: 0, y: -1 },
              { x: 1, y: 3 },
              { x: 2, y: 1 },
              { x: 3, y: 4 },
            ],
            lineName: 'Северный бур',
            color: colors.first,
            showValues: true,
          },
          {
            values: [
              { x: 0, y: -2 },
              { x: 1, y: 4 },
              { x: 2, y: 0 },
              { x: 3, y: 5 },
            ],
            lineName: 'Южное месторождение',
            color: colors.second,
            showValues: true,
          },
        ]}
        isHorizontal
      />
    )
  },
  {
    name: 'со значениями точек',
    decorators,
    parameters,
  }
)

export default createMetadata({
  title: 'components/LinearChart',
})
