import * as React from 'react'
import { useUID } from 'react-uid'

import { isDefined, isNotNil } from '@consta/widgets-utils/lib/type-guards'
import { useComponentSize } from '@gpn-design/uikit/useComponentSize'
import * as _ from 'lodash'

import { FormatValue } from '@/_private/types'
import { getFormattedValue } from '@/_private/utils/chart'
import { deg2rad } from '@/_private/utils/math'

import { RadarChartAxes } from './components/Axes'
import { RadarChartAxisName } from './components/AxisName'
import { AxisTooltip } from './components/AxisTooltip'
import { RadarChartFigure } from './components/Figure'
import { RadarChartPoints } from './components/Points'
import css from './index.css'

export type RadarChartLabelSize = 's' | 'm'

export type Point = {
  xPercent: number
  yPercent: number
  label: string | null
  axisName: string
  originalValue: number | null
}

export type NotEmptyPoint = {
  xPercent: number
  yPercent: number
  label: string
  axisName: string
  originalValue: number
}

export type FigureValue = {
  axisName: string
  value: number | null
}

export type Figure = {
  color: string
  name: string
  values: readonly FigureValue[]
}

export type Data = {
  maxValue: number
  axesLabels: Record<string, string>
  figures: readonly Figure[]
  formatValueForLabel?: FormatValue
  formatValueForTooltip?: FormatValue
}

type Props = {
  ticks: number
  figures: readonly Figure[]
  backgroundColor: string
  withConcentricColor: boolean
  labelSize: RadarChartLabelSize
} & Data

export type Axis = {
  name: string
  label: string
  angle: number
}

export type ExtendedFigure = Figure & {
  points: readonly Point[]
  isFilled: boolean
}

export const pointIsNotEmpty = (point: Point): point is NotEmptyPoint =>
  isNotNil(point.originalValue)

// Преобразуем кординаты от центра круга в координаты svg: 0 -> 50%, 1 -> 100%
const circleCoordToRelative = (circlePos: number) => _.round(50 * (1 + circlePos), 2)

/**
 * @param angle - угол в радианах
 * @param valueFraction - положение на оси (от 0 до 1)
 */
export const angleToCoord = (angle: number, valueFraction: number) => ({
  xPercent: circleCoordToRelative(Math.cos(angle) * valueFraction),
  yPercent: circleCoordToRelative(Math.sin(angle) * valueFraction),
})

export const sortFigureValues = (values: readonly FigureValue[], axesNames: readonly string[]) => {
  return _.sortBy(values, item => axesNames.indexOf(item.axisName))
}

type ConcentricColorInfo = {
  circles: readonly string[]
  gradient: ReadonlyArray<readonly [string, number]>
}

const concentricColorsByTicksAmount: { [key: number]: ConcentricColorInfo } = {
  3: {
    circles: ['#BD3600', '#F2C94C', '#20B55F'],
    gradient: [
      ['#BD3600', 0],
      ['#BD3600', 14.23],
      ['#F2C94C', 24.17],
      ['#F2C94C', 42.59],
      ['#20B55F', 65.42],
    ],
  },
  4: {
    circles: ['#FF0606', '#BD3600', '#F2C94C', '#20B55F'],
    gradient: [
      ['#FF2955', 0],
      ['#BD3600', 23.28],
      ['#F2C94C', 48.4],
      ['#20B55F', 73.99],
    ],
  },
  5: {
    circles: ['#FF0606', '#BD3600', '#FF8A00', '#F2C94C', '#20B55F'],
    gradient: [
      ['#FF2955', 0],
      ['#EB5757', 19.36],
      ['#FF6D32', 39.73],
      ['#FFDA36', 58.99],
      ['#20B55F', 79.07],
      ['#20B55F', 100],
    ],
  },
}

const BREAKPOINTS = [
  {
    fontSize: 12,
    minRadarSize: 0,
  },
  {
    fontSize: 14,
    minRadarSize: 151,
  },
  {
    fontSize: 16,
    minRadarSize: 191,
  },
] as const
const LINE_HEIGHT_EM = 1.2
const AXIS_NAME_WIDTH_EM = 8.125
const AXIS_NAME_OFFSET_EM = 1

const getCurrentSizes = (width: number, height: number) => {
  const breakpointsWithSizes = BREAKPOINTS.map(({ fontSize, minRadarSize }) => {
    const lineHeight = fontSize * LINE_HEIGHT_EM
    const axisNameWidth = fontSize * AXIS_NAME_WIDTH_EM
    const axisNameOffset = fontSize * AXIS_NAME_OFFSET_EM
    const radarSize = Math.min(
      width - 2 * (axisNameWidth + axisNameOffset),
      height - 2 * (2 * lineHeight + axisNameOffset)
    )

    return {
      fontSize,
      lineHeight,
      axisNameWidth,
      axisNameOffset,
      radarSize,
      minRadarSize,
    }
  })

  return (
    _.findLast(breakpointsWithSizes, bp => bp.radarSize >= bp.minRadarSize) ||
    breakpointsWithSizes[0]
  )
}

export const RadarChart: React.FC<Props> = ({
  ticks: originalTicks,
  maxValue,
  axesLabels,
  figures: originalFigures,
  backgroundColor,
  labelSize,
  formatValueForLabel,
  formatValueForTooltip,
  withConcentricColor,
}) => {
  // В радаре с градиентом может быть только 1 фигура и 3-5 колец
  const ticks = withConcentricColor ? _.clamp(originalTicks, 3, 5) : originalTicks
  const figures = withConcentricColor ? originalFigures.slice(0, 1) : originalFigures

  const [activeAxis, setActiveAxis] = React.useState<Axis>()

  const ref = React.useRef<HTMLDivElement>(null)
  const svgWrapperRef = React.useRef<HTMLDivElement>(null)
  const { width, height } = useComponentSize(ref)

  const { radarSize, fontSize, lineHeight, axisNameWidth, axisNameOffset } = getCurrentSizes(
    width,
    height
  )

  const gradientId = `radarchart_gradient_${useUID()}`

  const axesNames = Object.keys(axesLabels)
  const singleAxisSegment = 360 / axesNames.length
  const axesAngles: readonly Axis[] = Object.keys(axesLabels).map((axisName, idx) => {
    // смещаем на половину сегмента, чтобы лэйблы были между осями
    const angleDeg = idx * singleAxisSegment + singleAxisSegment / 2 - 90

    return {
      name: axisName,
      label: axesLabels[axisName],
      angle: deg2rad(angleDeg),
    }
  }, {})

  const concentricColors = withConcentricColor ? concentricColorsByTicksAmount[ticks] : undefined

  const extendedFigures: readonly ExtendedFigure[] = figures.map(figure => {
    const points = sortFigureValues(figure.values, axesNames)
      .map(value => {
        const theAxis = axesAngles.find(a => a.name === value.axisName)

        return theAxis
          ? {
              ...angleToCoord(theAxis.angle, isNotNil(value.value) ? value.value / maxValue : 0),
              label: isNotNil(value.value)
                ? getFormattedValue(value.value, formatValueForLabel)
                : '',
              axisName: value.axisName,
              originalValue: value.value,
            }
          : undefined
      })
      .filter(isDefined)

    const color = concentricColors
      ? {
          color: `url(#${gradientId})`,
          isFilled: false,
        }
      : {
          color: figure.color,
          isFilled: true,
        }

    return {
      ...figure,
      ...color,
      points,
    }
  })

  return (
    <div ref={ref} className={css.main}>
      {radarSize > 0 && (
        <div
          ref={svgWrapperRef}
          className={css.svgWrapper}
          style={{
            width: radarSize,
            height: radarSize,
          }}
        >
          <svg viewBox={`0 0 ${radarSize} ${radarSize}`} className={css.svg}>
            {concentricColors && (
              <defs>
                <radialGradient id={gradientId} gradientUnits="userSpaceOnUse">
                  {concentricColors.gradient.map(([color, offset], idx) => (
                    <stop key={idx} offset={`${offset}%`} stopColor={color} />
                  ))}
                </radialGradient>
              </defs>
            )}

            <RadarChartAxes
              ticks={ticks}
              maxValue={maxValue}
              backgroundColor={backgroundColor}
              axesAngles={axesAngles}
              labelSize={labelSize}
              formatValueForLabel={formatValueForLabel}
              colors={concentricColors && concentricColors.circles}
              activeAxis={activeAxis}
              onChangeActiveAxis={setActiveAxis}
            />

            {extendedFigures.map((f, idx) => (
              <RadarChartFigure
                key={idx}
                size={radarSize}
                points={f.points}
                lineColor={f.color}
                withFill={f.isFilled}
              />
            ))}

            {extendedFigures.map((f, idx) => (
              <RadarChartPoints
                key={idx}
                points={f.points}
                lineColor={f.color}
                activeAxis={activeAxis ? activeAxis.name : ''}
                backgroundColor={backgroundColor}
              />
            ))}
          </svg>

          {axesAngles.map(axis => {
            const { xPercent, yPercent } = angleToCoord(axis.angle, 1)

            return (
              <RadarChartAxisName
                key={axis.name}
                xPercent={xPercent}
                yPercent={yPercent}
                label={axis.label}
                fontSize={fontSize}
                lineHeight={lineHeight}
                width={axisNameWidth}
                offset={axisNameOffset}
              />
            )
          })}

          {svgWrapperRef.current && activeAxis && (
            <AxisTooltip
              extendedFigures={extendedFigures}
              axis={activeAxis}
              anchorEl={svgWrapperRef.current}
              formatValue={formatValueForTooltip || formatValueForLabel}
            />
          )}
        </div>
      )}
    </div>
  )
}
