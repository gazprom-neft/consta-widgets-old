import { isDefined } from '@consta/widgets-utils/lib/type-guards'

import { HalfDonut } from '@/_private/components/DonutChart/components/Donut'
import { Data as DonutChartData } from '@/_private/components/DonutChart/helpers'
import { isHalfDonutVertical } from '@/_private/components/DonutChart/helpers'
import { getValueRatio } from '@/ProgressBar'

import { Colors, Data } from '.'

export const DEFAULT_EMPTY_COLOR = 'var(--color-bg-ghost)'

export const DEFAULT_DATA = {
  value: 0,
  valueMin: 0,
  valueMax: 100,
} as const

const getColorIndex = (valueRatio: number) => Math.floor(Math.max(0, valueRatio - 1) / 100)

export const getColors = (colors: Colors, title: string, data: Data) => {
  const { value, valueMin, valueMax } = { ...DEFAULT_DATA, ...data }
  const valueRatio = Math.round(getValueRatio({ value, valueMin, valueMax }))
  const colorIndex = getColorIndex(valueRatio)

  const valueColor = colors[colorIndex % colors.length]
  const emptyColor =
    colorIndex === 0 ? DEFAULT_EMPTY_COLOR : colors[(colorIndex - 1) % colors.length]

  return {
    [title]: valueColor,
    empty: emptyColor,
  }
}

export const getValuePercent = (data: Data) => {
  const { value, valueMin, valueMax } = { ...DEFAULT_DATA, ...data }

  const valueRatio = getValueRatio({ value, valueMin, valueMax })

  if (valueRatio < 0) {
    return 0
  }

  if (valueRatio > 100) {
    return 100
  }

  return Math.round(valueRatio)
}

export const getTextData = (title: string, data: Data = {}) => {
  const { value, valuePlaceholder = '' } = data

  return {
    title,
    value: isDefined(value) ? getValuePercent(data) + '%' : valuePlaceholder,
  }
}

export const getData = ({
  title,
  data,
  halfDonut,
  colors,
}: {
  title: string
  data: Data
  halfDonut?: HalfDonut
  colors: Colors
}): readonly DonutChartData[] => {
  const { value, valueMin, valueMax } = { ...DEFAULT_DATA, ...data }
  const valueRatio = getValueRatio({ value, valueMin, valueMax })
  const isValueFull = valueRatio >= 100 && valueRatio % 100 === 0
  const donutColors = getColors(colors, title, data)

  const donutChartData: readonly DonutChartData[] = [
    {
      name: title,
      color: donutColors[title],
      values: [isValueFull ? 100 : valueRatio % 100],
    },
    {
      name: 'empty',
      color: donutColors.empty,
      values: [isValueFull ? 0 : 100 - (valueRatio % 100)],
    },
  ]

  if (halfDonut === 'top' || halfDonut === 'right') {
    return [...donutChartData].reverse()
  }

  return donutChartData
}

export const getMinChartSize = (halfDonut?: HalfDonut, showText?: boolean, showTitle?: boolean) => {
  if (!showText) {
    return 50
  }

  if (halfDonut && showTitle) {
    return 170
  }

  if (!halfDonut && showTitle) {
    return 128
  }

  if (isHalfDonutVertical(halfDonut) && !showTitle) {
    return 148
  }

  return 96
}
