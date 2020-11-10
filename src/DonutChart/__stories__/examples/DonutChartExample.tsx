import React from 'react'

import { Example } from '@/_private/storybook'

import { DonutChart } from '../..'
import {
  donutData,
  donutDataItemsWithZeroAndPositiveData,
  donutDataItemsWithZeroData,
  donutProgressData,
} from '../../data.mock'

export const DonutChartExample = () => (
  <Example height="200px">
    <DonutChart data={donutData.data} formatValueForTooltip={v => `${v}%`} />
  </Example>
)

export const DonutChartZero = () => (
  <Example height="200px">
    <DonutChart
      data={[
        {
          name: 'Нулевой бур',
          color: 'var(--color-bg-alert)',
          values: [0],
        },
      ]}
    />
  </Example>
)

export const DonutChartZero3 = () => (
  <Example height="200px">
    <DonutChart data={donutDataItemsWithZeroData.data} />
  </Example>
)

export const DonutChartZeroPositive = () => (
  <Example height="200px">
    <DonutChart data={donutDataItemsWithZeroAndPositiveData.data} />
  </Example>
)

export const DonutChartData4 = () => (
  <Example height="200px">
    <DonutChart
      data={[
        {
          name: 'Северный бур',
          color: 'var(--color-bg-alert)',
          values: [1, 2, 3],
        },
        {
          name: 'Южный бур',
          color: 'var(--color-bg-caution)',
          values: [4, 5, 6],
        },
        {
          name: 'Западный бур',
          color: 'var(--color-bg-normal)',
          values: [7, 8, 9],
        },
        {
          name: 'Неизвестный бур',
          color: '#9F0CE9',
          values: [null, 0, 8],
        },
      ]}
    />
  </Example>
)

export const DonutChartData40 = () => (
  <Example height="200px">
    <DonutChart
      data={[
        {
          name: 'Северный бур',
          color: 'var(--color-bg-alert)',
          values: [1, 2, 3],
        },
        {
          name: 'Южный бур',
          color: 'var(--color-bg-caution)',
          values: [4, 5, 6],
        },
        {
          name: 'Западный бур',
          color: 'var(--color-bg-normal)',
          values: [7, 8, 9],
        },
        {
          name: 'Неизвестный бур',
          color: '#9F0CE9',
          values: [null, null, null],
        },
      ]}
    />
  </Example>
)

export const DonutChartText = () => (
  <Example height="200px">
    <DonutChart
      data={donutProgressData.data}
      textData={{
        title: 'всего',
        value: '90',
        subTitle: 'МГРП',
        subValue: '20',
      }}
    />
  </Example>
)

export const DonutChartTextTop = () => (
  <Example height="200px">
    <DonutChart
      data={donutProgressData.data}
      textData={{
        title: 'всего',
        value: '90',
        subTitle: 'МГРП',
        subValue: '20',
      }}
      halfDonut="top"
    />
  </Example>
)

export const DonutChartTextRight = () => (
  <Example height="200px">
    <DonutChart
      data={donutProgressData.data}
      textData={{
        title: 'всего',
        value: '90',
        subTitle: 'МГРП',
        subValue: '20',
      }}
      halfDonut="right"
    />
  </Example>
)

export const DonutChartText40 = () => (
  <Example height="200px">
    <DonutChart
      data={donutProgressData.data}
      textData={{
        title: 'всего',
        value: '90',
        subTitle: 'МГРП',
        subValue: '20',
      }}
      valueSize={40}
      halfDonut="left"
    />
  </Example>
)

export const DonutChartText10 = () => (
  <Example height="200px">
    <DonutChart
      data={donutProgressData.data}
      textData={{
        title: 'всего',
        value: '90',
        subTitle: 'МГРП',
        subValue: '20',
      }}
      valueSize={10}
      halfDonut="right"
    />
  </Example>
)

export const DonutChartText20 = () => (
  <Example height="200px">
    <DonutChart
      data={donutProgressData.data}
      textData={{
        title: 'всего',
        value: '90',
        subTitle: 'МГРП',
        subValue: '20',
      }}
      valueSize={20}
      halfDonut="top"
    />
  </Example>
)

export const DonutChartTooltip = () => (
  <Example>
    <DonutChart data={donutData.data} halfDonut="top" formatValueForTooltip={v => `${v} км`} />
  </Example>
)

export const DonutChartHalfDonutTop = () => (
  <Example>
    <DonutChart data={donutData.data} halfDonut="top" />
  </Example>
)

export const DonutChartHalfDonutBottom = () => (
  <Example>
    <DonutChart data={donutData.data} halfDonut="bottom" />
  </Example>
)

export const DonutChartHalfDonutLeft = () => (
  <Example height="200px">
    <DonutChart data={donutData.data} halfDonut="left" />
  </Example>
)

export const DonutChartHalfDonutRight = () => (
  <Example height="200px">
    <DonutChart data={donutData.data} halfDonut="right" />
  </Example>
)
