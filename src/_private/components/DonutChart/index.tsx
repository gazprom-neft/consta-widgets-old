import React, { useRef, useState } from 'react'

import { createArrayOfIndexes } from '@consta/widgets-utils/lib/array'
import { isDefined } from '@consta/widgets-utils/lib/type-guards'
import { useComponentSize } from '@gpn-design/uikit/useComponentSize'
import { Position } from '@gpn-design/uikit/Popover'
import { Tooltip } from '@gpn-design/uikit/Tooltip'
import classnames from 'classnames'
import { zip } from 'lodash'

import { TooltipContentForMultipleValues } from '@/_private/components/TooltipContentForMultipleValues'
import { FormatValue } from '@/_private/types'

import { Data as DonutData, DataItem, Donut, HalfDonut } from './components/Donut'
import { Data as TextData, DonutText } from './components/Text'
import {
  Data,
  defaultGetCirclesCount,
  defaultGetMinChartSize,
  getChartSize,
  GetCirclesCount,
  getDonutRadius,
  GetMinChartSize,
  getSizeDonut,
  isHalfDonutHorizontal as getIsHalfDonutHorizontal,
  isHalfDonutVertical as getIsHalfDonutVertical,
} from './helpers'
import css from './index.css'

type LineRadius = {
  outerRadius: number
  innerRadius: number
}

type TooltipDataState = ReadonlyArray<{
  value: number
  color: string
  name: string
}>

export type Props = {
  data: readonly Data[]
  textData?: TextData
  titlePosition: 'top' | 'bottom'
  showShadow: boolean
  showTooltip: boolean
  showText: boolean
  showTitle: boolean
  showSubBlock: boolean
  textPaddingFromBorder: number
  halfDonut?: HalfDonut
  valueSize?: number
  getCirclesCount?: GetCirclesCount
  getMinChartSize?: GetMinChartSize
  formatValueForTooltip?: FormatValue
  filterTooltipItem?: (itemData: DataItem) => boolean
}

const halfDonutClasses: Record<NonNullable<HalfDonut>, string> = {
  top: css.halfTop,
  right: css.halfRight,
  bottom: css.halfBottom,
  left: css.halfLeft,
}

export const CoreDonutChart: React.FC<Props> = ({
  data = [],
  textData,
  titlePosition,
  showShadow,
  showTooltip,
  showText,
  showTitle,
  showSubBlock,
  textPaddingFromBorder,
  halfDonut,
  valueSize,
  getCirclesCount = defaultGetCirclesCount,
  getMinChartSize = defaultGetMinChartSize,
  formatValueForTooltip,
  filterTooltipItem = () => true,
}) => {
  const [tooltipData, changeTooltipData] = useState<TooltipDataState>([])
  const [mousePosition, changeMousePosition] = useState<Position>()
  const ref = useRef(null)
  const { width, height } = useComponentSize(ref)

  const isHalfDonutHorizontal = getIsHalfDonutHorizontal(halfDonut)
  const isHalfDonutVertical = getIsHalfDonutVertical(halfDonut)
  const size = width && height ? getChartSize({ width, height, halfDonut }) : 0
  const mainRadius = size / 2
  const svgOffsetX = halfDonut === 'left' ? 0 : -mainRadius
  const svgOffsetY = halfDonut === 'top' ? 0 : -mainRadius
  const svgWidth = isHalfDonutVertical ? mainRadius : size
  const svgHeight = isHalfDonutHorizontal ? mainRadius : size
  const viewBox = `${svgOffsetX}, ${svgOffsetY}, ${svgWidth}, ${svgHeight}`
  const circlesCount = getCirclesCount(data)
  const sizeDonut = getSizeDonut(circlesCount, isDefined(textData), halfDonut)
  const minChartSize = getMinChartSize(circlesCount, isDefined(textData), halfDonut)
  const shadowSize = Math.max(svgWidth, svgHeight) - sizeDonut * 2
  const isTooltipVisible = Boolean(tooltipData.length)

  const lineRadiuses: readonly LineRadius[] = createArrayOfIndexes(circlesCount).map(index => {
    const outerRadius = getDonutRadius(mainRadius, index, circlesCount)
    const innerRadius = outerRadius - sizeDonut

    return {
      outerRadius,
      innerRadius,
    }
  })

  const values = zip(
    ...data.map(item =>
      item.values.slice(0, circlesCount).map(value => ({
        color: item.color,
        name: item.name,
        value,
      }))
    )
  ) as readonly DonutData[]

  const isTextVisible = values.length === 1 && showText

  const handleMouseOver = showTooltip
    ? (d: DonutData) => {
        changeTooltipData(
          d.filter(filterTooltipItem).map(item => {
            const itemValue = isDefined(item.showValue) ? item.showValue : item.value

            return {
              value: itemValue,
              color: item.color,
              name: item.name,
            }
          })
        )
      }
    : () => null

  const handleMouseOut = () => {
    changeTooltipData([])
  }

  const handleMouseMove = (event: React.MouseEvent) => {
    changeMousePosition({
      x: event.clientX,
      y: event.clientY,
    })
  }

  return (
    <div
      ref={ref}
      className={css.main}
      style={{
        ['--min-size' as string]: `${minChartSize}px`,
        ['--donut-width' as string]: `${sizeDonut}px`,
      }}
    >
      {showShadow && (
        <div
          className={classnames(css.shadow, halfDonut ? halfDonutClasses[halfDonut] : css.full)}
          style={{
            width: shadowSize,
            height: shadowSize,
          }}
        />
      )}
      {isTooltipVisible && (
        <Tooltip size="m" position={mousePosition} isInteractive={false}>
          <TooltipContentForMultipleValues
            items={tooltipData}
            formatValueForTooltip={formatValueForTooltip}
          />
        </Tooltip>
      )}
      {isTextVisible && textData && (
        <DonutText
          data={textData}
          radius={lineRadiuses[0].innerRadius}
          halfDonut={halfDonut}
          lineWidth={sizeDonut}
          titlePosition={titlePosition}
          valueSize={valueSize}
          paddingFromBorder={textPaddingFromBorder}
          showTitle={showTitle}
          showSubBlock={showSubBlock}
        />
      )}
      <svg
        className={classnames(css.svg, halfDonut && halfDonutClasses[halfDonut])}
        viewBox={viewBox}
        onMouseMove={handleMouseMove}
      >
        {values.map((d, index) => {
          const { outerRadius, innerRadius } = lineRadiuses[index]

          return (
            <Donut
              key={index}
              data={d.filter(isDefined)}
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              handleMouseOver={handleMouseOver}
              handleMouseOut={handleMouseOut}
              isTooltipVisible={isTooltipVisible}
              halfDonut={halfDonut}
            />
          )
        })}
      </svg>
    </div>
  )
}
