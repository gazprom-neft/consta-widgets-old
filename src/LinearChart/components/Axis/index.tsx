import React, { useLayoutEffect, useMemo } from 'react'

import { isNotNil } from '@consta/widgets-utils/lib/type-guards'
import classnames from 'classnames'
import * as d3 from 'd3'
import * as _ from 'lodash'

import { FormatValue } from '@/_private/types'

import { ScaleLinear, TickValues } from '../..'
import { isInDomain } from '../../helpers'

import css from './index.css'

const TICK_PADDING = 15
const UNIT_X_OFFSET = 20
const UNIT_Y_OFFSET = 2
const UNIT_Y_MARGIN = 8

export type XLabelsPosition = 'top' | 'bottom'
export type YLabelsPosition = 'left' | 'right'

type GridConfigItem<Position> = {
  labels?: Position
  labelTicks?: number
  gridTicks?: number
  guide?: boolean
  withPaddings?: boolean
}

export type GridConfig = {
  x: GridConfigItem<XLabelsPosition>
  y: GridConfigItem<YLabelsPosition>
}

enum AxisDirections {
  top = 'axisTop',
  bottom = 'axisBottom',
  left = 'axisLeft',
  right = 'axisRight',
}

type Props = {
  width: number
  height: number
  scales: {
    [key in 'x' | 'y']: ScaleLinear
  }
  gridConfig: GridConfig
  onAxisSizeChange: (sizes: { xAxisHeight: number; yAxisWidth: number }) => void
  mainLabelTickValues: TickValues
  mainGridTickValues: TickValues
  secondaryLabelTickValues: TickValues
  secondaryGridTickValues: TickValues
  isHorizontal: boolean
  formatValueForLabel: FormatValue
  secondaryScaleUnit?: string
  xGuideValue: number
  yGuideValue: number
}

const defaultFormatLabel = (v: number) => String(v)

const addGuideToTicks = (ticks: TickValues, guideValue: number | undefined): TickValues =>
  isNotNil(guideValue) ? _.sortBy(_.uniq([...ticks, guideValue])) : ticks

export const getGridTicksWithGuide = ({
  isHorizontal,
  mainTickValues,
  secondaryTickValues,
  xGuideValue,
  yGuideValue,
}: {
  isHorizontal: boolean
  mainTickValues: TickValues
  secondaryTickValues: TickValues
  xGuideValue: number | undefined
  yGuideValue: number | undefined
}): { x: TickValues; y: TickValues } => {
  return isHorizontal
    ? {
        x: addGuideToTicks(mainTickValues, xGuideValue),
        y: addGuideToTicks(secondaryTickValues, yGuideValue),
      }
    : {
        x: addGuideToTicks(secondaryTickValues, xGuideValue),
        y: addGuideToTicks(mainTickValues, yGuideValue),
      }
}

const getGuideValue = ({
  showGuide,
  value,
  domain,
}: {
  showGuide: boolean | undefined
  value: number
  domain: readonly number[]
}): number | undefined => (showGuide && isInDomain(value, domain) ? value : undefined)

export const Axis: React.FC<Props> = ({
  width,
  height,
  scales: { x: scaleX, y: scaleY },
  gridConfig: {
    x: { labels: xLabelsPos, labelTicks: xLabelTicks, guide: showXGuide },
    y: { labels: yLabelsPos, labelTicks: yLabelTicks, guide: showYGuide },
  },
  onAxisSizeChange,
  mainLabelTickValues,
  mainGridTickValues,
  isHorizontal,
  formatValueForLabel,
  secondaryScaleUnit,
  xGuideValue,
  yGuideValue,
  secondaryLabelTickValues,
  secondaryGridTickValues,
}) => {
  const xLabelsRef = React.createRef<SVGGElement>()
  const yLabelsRef = React.createRef<SVGGElement>()
  const yUnitRef = React.createRef<SVGTextElement>()
  const yLabelsAndUnitRef = React.createRef<SVGSVGElement>()
  const xGridRef = React.createRef<SVGGElement>()
  const yGridRef = React.createRef<SVGGElement>()

  const [xAxisHeight, setXAxisHeight] = React.useState(0)
  const [yAxisWidth, setYAxisWidth] = React.useState(0)

  const xOnBottom = xLabelsPos === 'bottom'
  const yOnLeft = yLabelsPos === 'left'

  const { x: xGridTicks, y: yGridTicks } = getGridTicksWithGuide({
    isHorizontal,
    mainTickValues: mainGridTickValues,
    secondaryTickValues: secondaryGridTickValues,
    xGuideValue: getGuideValue({
      showGuide: showXGuide,
      value: xGuideValue,
      domain: scaleX.domain(),
    }),
    yGuideValue: getGuideValue({
      showGuide: showYGuide,
      value: yGuideValue,
      domain: scaleY.domain(),
    }),
  })
  const showXGrid = Boolean(xGridTicks.length)
  const showYGrid = Boolean(yGridTicks.length)

  const labelsAxis = useMemo(
    () => [
      {
        getEl: () => xLabelsRef.current,
        visible: Boolean(xLabelsPos),
        direction: xOnBottom ? AxisDirections.bottom : AxisDirections.top,
        scale: scaleX,
        ticks: xLabelTicks,
        classes: classnames(
          css.labels,
          css.isAxisX,
          xLabelsPos &&
            {
              bottom: css.isPositionBottom,
              top: css.isPositionTop,
            }[xLabelsPos]
        ),
        transform: xOnBottom ? `translateY(${height}px)` : '',
        values: isHorizontal ? mainLabelTickValues : secondaryLabelTickValues,
        formatLabel: isHorizontal ? formatValueForLabel : defaultFormatLabel,
      },
      {
        getEl: () => yLabelsRef.current,
        visible: Boolean(yLabelsPos),
        direction: yOnLeft ? AxisDirections.left : AxisDirections.right,
        scale: scaleY,
        ticks: yLabelTicks,
        classes: classnames(
          css.labels,
          css.isAxisY,
          yLabelsPos &&
            {
              left: css.isPositionLeft,
              right: css.isPositionRight,
            }[yLabelsPos]
        ),
        transform: yOnLeft ? '' : `translateX(${width}px)`,
        values: isHorizontal ? secondaryLabelTickValues : mainLabelTickValues,
        formatLabel: isHorizontal ? defaultFormatLabel : formatValueForLabel,
      },
    ],
    [
      formatValueForLabel,
      height,
      isHorizontal,
      mainLabelTickValues,
      scaleX,
      scaleY,
      secondaryLabelTickValues,
      width,
      xLabelTicks,
      xLabelsPos,
      xLabelsRef,
      xOnBottom,
      yLabelTicks,
      yLabelsPos,
      yLabelsRef,
      yOnLeft,
    ]
  )
  const showXLabels = Boolean(labelsAxis[0].values.length)
  const showYLabels = Boolean(labelsAxis[1].values.length)

  // d3 некорректно обновляет направление оси, поэтому приходится удалять ось и пересоздавать заново
  // @see https://github.com/d3/d3-axis/issues/45
  useLayoutEffect(() => {
    labelsAxis.forEach(labels => {
      const labelsSelection = d3.select(labels.getEl())

      labelsSelection.select('g').remove()

      if (labels.visible) {
        labelsSelection.append('g')
      }
    })
  }, [labelsAxis, xLabelsPos, yLabelsPos])

  useLayoutEffect(() => {
    // Labels
    labelsAxis.forEach(labels => {
      if (labels.visible) {
        const axisSelection = d3.select(labels.getEl()).select('g') as d3.Selection<
          SVGGElement,
          unknown,
          null,
          undefined
        >
        const axis = d3[labels.direction](labels.scale)
          .tickValues([...labels.values])
          .tickPadding(TICK_PADDING)
          .tickFormat(v => labels.formatLabel(v as number))

        axisSelection
          .attr('class', labels.classes)
          .style('transform', labels.transform)
          .call(axis)
          .selectAll('text')
          .style('text-anchor', (_datum, index, els) => {
            if (['axisBottom', 'axisTop'].includes(labels.direction)) {
              if (index === 0) {
                return 'start'
              }
              if (index === els.length - 1) {
                return 'end'
              }
              return 'middle'
            } else {
              return ''
            }
          })
      }
    })

    // Grid lines
    const xGridBase = d3
      .axisBottom(scaleX)
      .tickSize(height)
      .tickFormat(() => '')
    const yGridBase = d3
      .axisLeft(scaleY)
      .tickSize(-width)
      .tickFormat(() => '')

    const grids = [
      {
        el: xGridRef.current,
        axis: xGridBase.tickValues([...xGridTicks]),
        withGuide: showXGuide,
        guideValue: xGuideValue,
      },
      {
        el: yGridRef.current,
        axis: yGridBase.tickValues([...yGridTicks]),
        withGuide: showYGuide,
        guideValue: yGuideValue,
      },
    ] as const

    grids.forEach(grid => {
      if (grid.el) {
        d3.select(grid.el)
          .call(grid.axis)
          .selectAll('.tick')
          .select('line')
          .attr('class', d => (grid.withGuide && d === grid.guideValue ? css.axisLine : ''))
      }
    })
  })

  useLayoutEffect(() => {
    const newXAxisHeight = xLabelsRef.current
      ? xLabelsRef.current.getBoundingClientRect().height
      : 0
    const newYUnitHeight = yUnitRef.current
      ? yUnitRef.current.getBoundingClientRect().height + UNIT_Y_MARGIN
      : 0
    setXAxisHeight(newXAxisHeight + newYUnitHeight)

    const newYAxisWidth = yLabelsAndUnitRef.current
      ? yLabelsAndUnitRef.current.getBoundingClientRect().width
      : 0
    setYAxisWidth(newYAxisWidth)
  }, [xLabelsRef, yUnitRef, setXAxisHeight, yLabelsAndUnitRef, setYAxisWidth])

  useLayoutEffect(() => {
    onAxisSizeChange({ xAxisHeight, yAxisWidth })
  }, [onAxisSizeChange, xAxisHeight, yAxisWidth])

  return (
    <g className={css.main}>
      {showXGrid && <g className={css.grid} ref={xGridRef} />}
      {showYGrid && <g className={css.grid} ref={yGridRef} />}

      {showXLabels && (
        <g>
          <g ref={xLabelsRef} />
          {!isHorizontal && (
            <text
              ref={yUnitRef}
              className={classnames(css.labels, css.unit)}
              x="100%"
              y={xOnBottom ? height + xAxisHeight - UNIT_Y_OFFSET : -xAxisHeight + UNIT_Y_OFFSET}
              dominantBaseline={xOnBottom ? 'bottom' : 'hanging'}
              textAnchor="end"
            >
              {secondaryScaleUnit}
            </text>
          )}
        </g>
      )}

      {showYLabels && (
        <g ref={yLabelsAndUnitRef}>
          <g ref={yLabelsRef} />
          {isHorizontal && (
            <text
              className={classnames(css.labels, css.unit, css.isAxisY)}
              x={yOnLeft ? -UNIT_X_OFFSET : width + UNIT_X_OFFSET}
              y={0}
              textAnchor={yOnLeft ? 'end' : 'start'}
            >
              {secondaryScaleUnit}
            </text>
          )}
        </g>
      )}
    </g>
  )
}
