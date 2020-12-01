import React, { useLayoutEffect, useRef, useState } from 'react'

import { useComponentSize } from '@consta/uikit/useComponentSize'
import { Text, TextPropSize } from '@consta/uikit/Text'
import classnames from 'classnames'

import { Grid } from '@/_private/components/Grid'
import { FormatValue } from '@/_private/types'
import { NumberRange, scaleLinear } from '@/_private/utils/scale'
import { getTicks } from '@/_private/utils/ticks'

import { Title } from '../Title'

import { ColumnSize } from './components/Column'
import { Threshold } from './components/Threshold'
import { Position, Size as TicksSize } from './components/Ticks'
import { Tooltip, TooltipData } from './components/Tooltip'
import {
  CHART_MIN_HEIGHT,
  defaultGetAxisShowPositions,
  GetAxisShowPositions,
  getColumnSize,
  getEveryNTick,
  getGridColumnGap,
  getGridRowGap,
  getGridSettings,
  getLabelGridAreaName,
  getRange,
  getScaler,
  Size,
  toAxisSize,
} from './helpers'
import css from './index.css'
import {
  defaultRenderAxisValues,
  defaultRenderGroupsLabels,
  RenderAxisValues,
  RenderGroup,
  RenderGroupsLabels,
} from './renders'

export const unitPositions = ['left', 'bottom', 'left-and-bottom', 'none'] as const
export type UnitPosition = typeof unitPositions[number]

export type OnMouseHoverColumn = (groupName: string) => void

export type Threshold = {
  value: number
  color: string
}

export type LabelSize = {
  width: number
  height: number
}

export type Props<T> = {
  groupsDomain: readonly string[]
  valuesDomain: NumberRange
  groups: readonly T[]
  maxColumn: number
  gridTicks: number
  valuesTicks: number
  size: Size
  isHorizontal?: boolean
  withScroll?: boolean
  showValues?: boolean
  showReversed?: boolean
  isXAxisLabelsSlanted?: boolean
  unit?: string
  unitPosition?: UnitPosition
  isDense?: boolean
  activeSectionIndex?: number
  activeGroup?: string
  threshold?: Threshold
  title?: React.ReactNode
  renderGroup: RenderGroup<T>
  getAxisShowPositions?: GetAxisShowPositions
  formatValueForLabel?: FormatValue
  formatValueForTooltip?: FormatValue
  renderGroupsLabels?: RenderGroupsLabels
  renderAxisValues?: RenderAxisValues
  onMouseEnterColumn?: OnMouseHoverColumn
  onMouseLeaveColumn?: OnMouseHoverColumn
  gridRowGap?: number | string
  gridColumnGap?: number | string
}

const unitSize: Record<TicksSize, TextPropSize> = {
  s: '2xs',
  m: 'xs',
  l: 'xs',
}

const columnSizeClasses: Record<ColumnSize, string> = {
  s: css.columnSizeS,
  m: css.columnSizeM,
  l: css.columnSizeL,
  xl: css.columnSizeXL,
  '2xl': css.columnSize2XL,
  '3xl': css.columnSize3XL,
}

const axisTicksPositionsClasses = {
  left: css.leftTicks,
  bottom: css.bottomTicks,
  right: css.rightTicks,
  top: css.topTicks,
}

const renderUnit = (className: string, unit: string, size: TicksSize) => (
  <Text as="div" size={unitSize[size]} view="secondary" className={className}>
    {unit}
  </Text>
)

export const CoreBarChart = <T,>(props: Props<T>) => {
  const {
    groupsDomain,
    valuesDomain,
    groups,
    maxColumn,
    gridTicks,
    valuesTicks,
    isHorizontal = false,
    withScroll = false,
    showValues = false,
    showReversed = false,
    size,
    unit,
    unitPosition = 'none',
    isDense = false,
    activeSectionIndex,
    activeGroup,
    threshold,
    title,
    getAxisShowPositions = defaultGetAxisShowPositions,
    formatValueForLabel = String,
    formatValueForTooltip,
    renderGroup,
    renderAxisValues = defaultRenderAxisValues,
    renderGroupsLabels = defaultRenderGroupsLabels,
    isXAxisLabelsSlanted,
    onMouseEnterColumn,
    onMouseLeaveColumn,
    gridRowGap,
    gridColumnGap,
  } = props
  const ref = useRef<HTMLDivElement>(null)
  const svgRef = useRef(null)
  const groupsRef = useRef([React.createRef<HTMLDivElement>(), React.createRef<HTMLDivElement>()])
  /**
   * Испольуется как тригер, чтобы при ресайзе окна мы делали перерасчет всех элементов
   */
  const { width, height } = useComponentSize(ref)
  const [gridStyle, changeGridStyle] = useState({ width: 0, height: 0, left: 0, top: 0 })

  const [tooltipData, setTooltipData] = useState<TooltipData>()
  const [maxLabelSize, setMaxLabelSize] = useState<LabelSize>({
    width: 0,
    height: 0,
  })

  const maxValue = valuesDomain[1]
  const columnSize = getColumnSize({
    size,
    valueLength: maxValue.toString().length,
    isHorizontal,
  })

  const paddingRight = isHorizontal && showValues ? maxLabelSize.width : 0
  const paddingLeft = showReversed ? paddingRight : 0
  const paddingTop = !isHorizontal && showValues ? maxLabelSize.height : 0
  const paddingBottom = showReversed ? paddingTop : 0
  const scaler = getScaler(maxValue)
  const valuesScale = scaleLinear({
    domain: valuesDomain,
    range: getRange(
      isHorizontal ? Math.round(gridStyle.width) : Math.round(gridStyle.height),
      !isHorizontal
    ),
  })
  const gridItems = getTicks(valuesDomain, gridTicks)
  const axisValues = getEveryNTick(gridItems, valuesTicks)
  const gridXTickValues = isHorizontal ? gridItems : []
  const gridYTickValues = isHorizontal ? [] : gridItems
  const axisShowPositions = getAxisShowPositions({ isHorizontal, showReversed })
  const horizontalStyles = {
    paddingLeft,
    paddingRight,
  }
  const verticalStyles = {
    paddingTop,
    paddingBottom,
  }

  const handleMouseEnterColumn = (groupName: string, params: TooltipData) => {
    setTooltipData(params)

    onMouseEnterColumn && onMouseEnterColumn(groupName)
  }

  const handleMouseLeaveColumn = (groupName: string) => {
    setTooltipData(undefined)

    onMouseLeaveColumn && onMouseLeaveColumn(groupName)
  }

  const changeLabelSize = (labelSize: LabelSize) => {
    if (maxLabelSize.width >= labelSize.width && maxLabelSize.height >= labelSize.height) {
      return
    }

    setMaxLabelSize({
      width: labelSize.width,
      height: labelSize.height,
    })
  }

  useLayoutEffect(() => {
    const firstGroup = groupsRef.current[0].current
    // Если группа всего одна, то считаем её как первую и как последнюю
    const lastGroup = groupsRef.current[1].current || groupsRef.current[0].current

    if (ref && ref.current && firstGroup && lastGroup) {
      const left =
        firstGroup.getBoundingClientRect().left - ref.current.getBoundingClientRect().left
      const top = firstGroup.getBoundingClientRect().top - ref.current.getBoundingClientRect().top
      const newHeight =
        lastGroup.getBoundingClientRect().bottom - firstGroup.getBoundingClientRect().top
      const newWidth =
        lastGroup.getBoundingClientRect().right - firstGroup.getBoundingClientRect().left

      changeGridStyle({
        left: left + paddingLeft,
        top: top + paddingTop,
        height: newHeight - paddingTop - paddingBottom,
        width: newWidth - paddingLeft - paddingRight,
      })
    }
  }, [
    ref,
    isHorizontal,
    width,
    height,
    paddingLeft,
    paddingRight,
    paddingTop,
    paddingBottom,
    groupsRef,
  ])

  const getRenderGroupsLabels = (position: Position) =>
    renderGroupsLabels({
      values: groupsDomain,
      position,
      size: columnSize,
      getGridAreaName: getLabelGridAreaName(position),
      isXAxisLabelsSlanted,
    })

  const getRenderAxisValues = (position: Position) => (
    <div
      className={axisTicksPositionsClasses[position]}
      style={
        ['top', 'bottom'].includes(position)
          ? { marginLeft: `${gridStyle.left}px` }
          : verticalStyles
      }
    >
      {renderAxisValues({
        values: axisValues,
        scaler: valuesScale,
        position,
        size: columnSize,
        formatValueForLabel,
      })}
    </div>
  )

  const renderHorizontal = isHorizontal ? getRenderAxisValues : getRenderGroupsLabels
  const renderVertical = isHorizontal ? getRenderGroupsLabels : getRenderAxisValues

  const showUnitLeft =
    unitPosition !== 'none' && (unitPosition === 'left' || unitPosition === 'left-and-bottom')
  const showUnitBottom =
    unitPosition !== 'none' && (unitPosition === 'bottom' || unitPosition === 'left-and-bottom')

  const axisSize = toAxisSize(columnSize)
  const computedGridRowGap = gridRowGap ?? getGridRowGap(axisSize, isHorizontal)
  const computedGridColumnGap = gridColumnGap ?? getGridColumnGap(axisSize)

  /**
   * Из за различий в построении осей для горизонтального и вертикального режима
   * пришлось задублировать рендер axisShowPositions
   * Для isHorizontal рендерится вне обертки с барчартом, чтобы при скролле ось оставалась на месте.
   * Для !isHorizontal рендерится внутри обертки, для того, чтобы лейблы строились по grid сетке.
   */
  return (
    <div className={css.wrapper}>
      <Title style={{ paddingLeft: gridStyle.left }}>{title}</Title>
      <div className={classnames(css.main, withScroll && isHorizontal && css.withVerticalScroll)}>
        {isHorizontal && axisShowPositions.top && renderHorizontal('top')}
        <div
          ref={ref}
          className={classnames(
            css.chart,
            isHorizontal && css.isHorizontal,
            columnSizeClasses[columnSize]
          )}
          style={{
            ...getGridSettings({
              isHorizontal,
              countGroups: groups.length,
              showUnitBottom,
              showUnitLeft,
              maxColumn,
              axisShowPositions,
            }),
            gridGap: `${computedGridRowGap} ${computedGridColumnGap}`,
          }}
        >
          <svg className={css.svg} ref={svgRef} style={gridStyle}>
            <Grid
              scalerX={valuesScale}
              scalerY={valuesScale}
              xTickValues={gridXTickValues}
              yTickValues={gridYTickValues}
              width={gridStyle.width}
              height={gridStyle.height}
            />
            {threshold && (
              <Threshold
                valuesScale={valuesScale}
                isHorizontal={isHorizontal}
                color={threshold.color}
                value={threshold.value}
              />
            )}
          </svg>
          {unit && showUnitLeft && renderUnit(css.topLeftUnit, unit, axisSize)}
          {!isHorizontal && axisShowPositions.top && renderHorizontal('top')}
          {axisShowPositions.right && renderVertical('right')}
          {groups.map((group, groupIdx) => {
            const isFirstGroup = groupIdx === 0
            const isLastGroup = groupIdx === groups.length - 1

            return (
              <div
                key={groupIdx}
                ref={
                  isFirstGroup || isLastGroup ? groupsRef.current[isFirstGroup ? 0 : 1] : undefined
                }
                style={{
                  gridArea: `group${groupIdx}`,
                  minHeight: !isHorizontal ? CHART_MIN_HEIGHT : undefined,
                  ...horizontalStyles,
                  ...verticalStyles,
                }}
                className={css.groupWrapper}
              >
                {renderGroup({
                  item: group,
                  index: groupIdx,
                  isLast: isLastGroup,
                  isFirst: isFirstGroup,
                  isDense,
                  columnSize,
                  showValues,
                  showReversed,
                  isHorizontal,
                  activeGroup,
                  activeSectionIndex,
                  scaler,
                  onMouseEnterColumn: handleMouseEnterColumn,
                  onMouseLeaveColumn: handleMouseLeaveColumn,
                  formatValueForLabel,
                  onChangeLabelSize: changeLabelSize,
                })}
              </div>
            )
          })}
          {axisShowPositions.left && renderVertical('left')}
          {!isHorizontal && axisShowPositions.bottom && renderHorizontal('bottom')}
          {unit && showUnitBottom && renderUnit(css.bottomUnit, unit, axisSize)}
        </div>
        {isHorizontal && axisShowPositions.bottom && renderHorizontal('bottom')}
        {tooltipData && (
          <Tooltip
            data={tooltipData}
            isHorizontal={isHorizontal}
            formatValue={formatValueForTooltip || formatValueForLabel}
          />
        )}
      </div>
    </div>
  )
}
