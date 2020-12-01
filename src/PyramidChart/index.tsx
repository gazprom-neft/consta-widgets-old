import React from 'react'

import { Text } from '@consta/uikit/Text'
import { isNotNil } from '@consta/widgets-utils/lib/type-guards'

import { Title } from '@/_private/components/Title'

import css from './index.css'

export type Data = {
  text: string
  value: string | number | null | undefined
}

type Props = {
  data: readonly Data[]
  colors: readonly string[]
  constraint?: boolean
  fontSize?: 'xs' | 's' | 'm'
  title?: React.ReactNode
}

export const DEFAULT_COLORS = [
  '#FC4449',
  '#FF6D32',
  '#FF9724',
  '#F7CC1D',
  '#59D72C',
  '#00BD59',
] as const

const PYRAMID_WIDTH = 312
const SECTION_HEIGHT = 45
const SECTION_TEXT_WIDTH = 300

const getLineCoords = (
  countLines: number,
  height: number | undefined,
  width: number | undefined,
  isGradient: boolean
) => {
  if (!height || !width) {
    return []
  }

  const center = width / 2
  const widthPart = center / countLines
  const heightPart = height / countLines
  const startingPoint = isGradient ? 0 : 1

  return new Array(countLines)
    .fill(null)
    .map((_, index) =>
      [
        [center - widthPart * index * startingPoint, heightPart * index].join(','),
        [center - widthPart * (index + 1) * startingPoint, heightPart * (index + 1)].join(','),
        [center + widthPart * (index + 1), heightPart * (index + 1)].join(','),
        [center + widthPart * index, heightPart * index].join(','),
      ].join('L')
    )
}

const buildTriangleSectionPath = (
  data: readonly Data[],
  height: number,
  width: number,
  isGradient: boolean,
  colors: readonly string[]
) => {
  const fillBlackSemi = 'rgba(0,0,0,.5)'

  return getLineCoords(data.length, height, width, isGradient).map((item, index) => (
    <path key={index} d={`M${item}`} fill={isGradient ? fillBlackSemi : colors[index]} />
  ))
}

export const PyramidChart: React.FC<Props> = ({
  data,
  colors,
  constraint = true,
  fontSize = 's',
  title,
}) => {
  const containerHeightResponsive = data.length * SECTION_HEIGHT
  const pyramidWidthHalf = PYRAMID_WIDTH / 2
  const tableWidthResponsive = constraint ? PYRAMID_WIDTH : '100%'

  const items = data.map(item => {
    const value = isNotNil(item.value) ? item.value : '–'

    return {
      text: item.text,
      value,
    }
  })

  return (
    <div className={css.main}>
      <Title>{title}</Title>
      <div
        className={css.svgWrapper}
        style={{ width: PYRAMID_WIDTH, height: containerHeightResponsive }}
      >
        <svg viewBox={`0 0 ${PYRAMID_WIDTH} ${containerHeightResponsive}`}>
          {buildTriangleSectionPath(data, containerHeightResponsive, PYRAMID_WIDTH, false, colors)}
          {buildTriangleSectionPath(data, containerHeightResponsive, PYRAMID_WIDTH, true, colors)}
        </svg>
      </div>
      <table
        className={css.table}
        style={{
          minWidth: PYRAMID_WIDTH,
          maxWidth: pyramidWidthHalf + SECTION_TEXT_WIDTH,
          width: tableWidthResponsive,
          height: containerHeightResponsive,
        }}
      >
        <tbody>
          {items.map((item, index) => (
            <tr key={index}>
              <td style={{ width: pyramidWidthHalf }}>
                <Text as="div" size="2xl" weight="bold" spacing="xs" view="primary" align="right">
                  {item.value}
                </Text>
              </td>
              <td>
                <Text
                  as="span"
                  size={fontSize}
                  view="primary"
                  lineHeight="xs"
                  className={css.textEllipsis}
                >
                  {item.text}
                </Text>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
