import React from 'react'
import { uid } from 'react-uid'

import { isNotNil } from '@consta/widgets-utils/lib/type-guards'
import * as d3 from 'd3'
import * as _ from 'lodash'

import { Title } from '@/_private/components/Title'
import { FormatValue } from '@/_private/types'
import { getEveryN } from '@/_private/utils/array'

import { Axis, GridConfig } from './components/Axis'
import { BoundariesAxisLine } from './components/BoundariesAxisLine'
import { BoundariesGradient } from './components/BoundariesGradient'
import { HoverLines } from './components/HoverLines'
import { LineTooltip } from './components/LineTooltip'
import { LineWithDots } from './components/LineWithDots'
import { Threshold } from './components/Threshold'
import { defaultZoom, getZoomScale, isDefaultZoom, Zoom, ZoomState } from './components/Zoom'
import {
  calculateSecondaryDomain,
  flipPointsOnAxes,
  getColorFromFirstLineWithBoundaries,
  getMainTickValues,
  getSecondaryTickValues,
  getXScale,
  getYScale,
  INITIAL_DOMAIN,
  invertDomain,
  padDomain,
  zoomDomain,
} from './helpers'
import css from './index.css'

export type Item = { x: number | null; y: number | null }
export type NotEmptyItem = { x: number; y: number }
export const itemIsNotEmpty = (item: Item): item is NotEmptyItem =>
  isNotNil(item.x) && isNotNil(item.y)

const DEFAULT_DIRECTION_X: DirectionX = 'toRight'

const getDefaultDirectionY = (isHorizontal: boolean): DirectionY => {
  return isHorizontal ? 'toTop' : 'toBottom'
}

type ThresholdLine = {
  name?: string
  values: readonly NotEmptyItem[]
}
export type Threshold = {
  max: ThresholdLine
  min?: ThresholdLine
}

export type Boundary = {
  color: string
  value: readonly [number, number]
}

export type Line = {
  values: readonly Item[]
  dots?: boolean
  withGradient?: boolean
  withBoundaries?: boolean
  lineName: string
  color: string
}
export type NumberRange = readonly [number, number]
export type TickValues = readonly number[]
export type ScaleLinear = d3.ScaleLinear<number, number>
export const directionsX = ['toRight', 'toLeft'] as const
export type DirectionX = typeof directionsX[number]
export const directionsY = ['toTop', 'toBottom'] as const
export type DirectionY = typeof directionsY[number]
export const axes = ['x', 'y'] as const
export type Axis = typeof axes[number]

type Props = {
  directionX?: DirectionX
  directionY?: DirectionY
  lines: readonly Line[]
  gridConfig: GridConfig
  threshold?: Threshold
  withZoom?: boolean
  isHorizontal: boolean
  formatValueForLabel?: FormatValue
  formatValueForTooltip?: FormatValue
  formatValueForTooltipTitle?: FormatValue
  unit?: string
  title?: React.ReactNode
  onClickHoverLine?: (value: number) => void
  background?: string
} & (
  | {
      boundaries?: never
    }
  | {
      boundaries: readonly Boundary[]
      boundariesAxis: Axis
      showBoundariesOnAxis: boolean
    }
)

export type HoveredMainValue = number | undefined

type State = {
  xDomain: NumberRange
  yDomain: NumberRange
  width: number
  height: number
  paddingX: number
  paddingY: number
  zoom: ZoomState
  xGuideValue: number
  yGuideValue: number
  hoveredMainValue: HoveredMainValue
}

export const TRANSITION_DURATIONS = {
  ZOOM: 750,
  SIZE: 600,
}

const DOT_SIZE = 5

export const domainPaddings = {
  horizontal: {
    top: 0.055,
    right: 0.06,
    bottom: 0,
    left: 0,
  },
  vertical: {
    top: 0.04,
    bottom: 0.04,
    right: 0.06,
    left: 0.06,
  },
}

export class LinearChart extends React.Component<Props, State> {
  ref = React.createRef<HTMLDivElement>()
  svgWrapperRef = React.createRef<SVGSVGElement>()

  resizeObserver = new ResizeObserver(() => this.updateSize())

  // d3 ограничивает по 1 анимации на элемент, поэтому создаём фэйковые элементы для твинов стэйта
  paddingTransitionEl = {} as Element
  secondaryDomainTransitionEl = {} as Element

  uid = uid(this)
  lineClipId = `line_clipPath_${this.uid}`
  dotsClipId = `dots_clipPath_${this.uid}`
  boundariesGradientId = `boundaries_gradient_${this.uid}`

  state: State = {
    xDomain: INITIAL_DOMAIN,
    yDomain: INITIAL_DOMAIN,
    width: 0,
    height: 0,
    paddingX: 0,
    paddingY: 0,
    zoom: defaultZoom,
    xGuideValue: 0,
    yGuideValue: 0,
    hoveredMainValue: undefined,
  }

  targetSecondaryDomain = this.state.xDomain
  targetPaddings = {
    paddingX: this.state.paddingX,
    paddingY: this.state.paddingY,
  }

  componentDidMount() {
    this.updateDomains()
    this.updateSize()

    this.resizeObserver.observe(this.ref.current!)
  }

  componentDidUpdate(prevProps: Props) {
    const {
      props: { lines, threshold, isHorizontal, directionX, directionY },
    } = this

    if (
      lines !== prevProps.lines ||
      isHorizontal !== prevProps.isHorizontal ||
      threshold !== prevProps.threshold ||
      directionX !== prevProps.directionX ||
      directionY !== prevProps.directionY
    ) {
      this.updateDomains()
    }
  }

  componentWillUnmount() {
    this.resizeObserver.unobserve(this.ref.current!)
  }

  render() {
    const {
      props,
      state: { paddingX, paddingY, xDomain, yDomain, xGuideValue, yGuideValue, hoveredMainValue },
      boundariesGradientId,
    } = this

    const {
      gridConfig,
      gridConfig: {
        x: { labels: xLabelsPos },
        y: { labels: yLabelsPos },
      },
      directionX = DEFAULT_DIRECTION_X,
      directionY = getDefaultDirectionY(props.isHorizontal),
      withZoom,
      isHorizontal,
      lines,
      formatValueForLabel = String,
      formatValueForTooltip,
      formatValueForTooltipTitle,
      unit,
      title,
      onClickHoverLine,
      background,
    } = props

    const { svgWidth, svgHeight } = this.getSvgSize()
    const { secondary: secondaryAxis } = this.getAxis()
    const {
      mainLabelTickValues,
      mainGridTickValues,
      secondaryLabelTickValues,
      secondaryGridTickValues,
    } = this.getTicks()
    const threshold = this.getThreshold()

    const lineClipPath = `url(#${this.lineClipId})`
    const dotsClipPath = `url(#${this.dotsClipId})`
    const scaleX = getXScale(xDomain, svgWidth)
    const scaleY = getYScale(yDomain, svgHeight)
    const dotRadius = DOT_SIZE / 2
    const xOnBottom = xLabelsPos === 'bottom'
    const yOnLeft = yLabelsPos === 'left'

    return (
      <div className={css.main}>
        <LineTooltip
          lines={this.getLines()}
          isHorizontal={isHorizontal}
          scaleX={scaleX}
          scaleY={scaleY}
          hoveredMainValue={hoveredMainValue}
          anchorEl={this.svgWrapperRef.current}
          threshold={threshold}
          formatValueForLabel={formatValueForLabel}
          formatValueForTooltip={formatValueForTooltip}
          formatValueForTooltipTitle={formatValueForTooltipTitle}
          {...(props.boundaries
            ? { boundaries: props.boundaries, boundariesAxis: props.boundariesAxis }
            : {})}
        />
        <Title style={{ paddingLeft: paddingX }}>{title}</Title>
        <div ref={this.ref} className={css.graph}>
          <svg
            ref={this.svgWrapperRef}
            className={css.svg}
            width={svgWidth}
            height={svgHeight}
            style={{
              ...(xOnBottom ? { top: 0 } : { bottom: 0 }),
              ...(yOnLeft ? { right: 0 } : { left: 0 }),
              background,
            }}
          >
            <defs>
              <clipPath id={this.lineClipId}>
                <rect width={svgWidth} height={svgHeight} />
              </clipPath>
              <clipPath id={this.dotsClipId}>
                <rect
                  width={svgWidth + 2 * dotRadius}
                  height={svgHeight + 2 * dotRadius}
                  x={-1 * dotRadius}
                  y={-1 * dotRadius}
                />
              </clipPath>
              {props.boundaries && (
                <BoundariesGradient
                  id={boundariesGradientId}
                  color={getColorFromFirstLineWithBoundaries(lines)}
                  boundaries={props.boundaries}
                  axis={props.boundariesAxis}
                  svgWidth={svgWidth}
                  svgHeight={svgHeight}
                  scaleX={scaleX}
                  scaleY={scaleY}
                  isHorizontal={isHorizontal}
                  directionX={directionX}
                  directionY={directionY}
                />
              )}
            </defs>
            <Axis
              width={svgWidth}
              height={svgHeight}
              scales={{
                x: scaleX,
                y: scaleY,
              }}
              gridConfig={gridConfig}
              onAxisSizeChange={this.onAxisSizeChange}
              mainLabelTickValues={mainLabelTickValues}
              mainGridTickValues={mainGridTickValues}
              secondaryLabelTickValues={secondaryLabelTickValues}
              secondaryGridTickValues={secondaryGridTickValues}
              isHorizontal={isHorizontal}
              formatValueForLabel={formatValueForLabel}
              secondaryScaleUnit={unit}
              xGuideValue={xGuideValue}
              yGuideValue={yGuideValue}
            />

            <HoverLines
              lines={this.getLines()}
              scaleX={scaleX}
              scaleY={scaleY}
              width={svgWidth}
              height={svgHeight}
              isHorizontal={isHorizontal}
              hoveredMainValue={hoveredMainValue}
              onChangeHoveredMainValue={this.setHoveredMainValue}
              onClickLine={onClickHoverLine}
            />

            {threshold && (
              <Threshold
                scaleX={scaleX}
                scaleY={scaleY}
                maxPoints={threshold.max.values}
                minPoints={threshold.min?.values}
                clipPath={lineClipPath}
                isHorizontal={isHorizontal}
              />
            )}

            {this.getLines().map(line => {
              const gradientProps = line.withGradient
                ? ({
                    withGradient: true,
                    areaBottom: secondaryAxis.currentDomain[secondaryAxis.isInverted ? 1 : 0],
                    gradientDirectionX: directionX,
                    gradientDirectionY: directionY,
                  } as const)
                : ({
                    withGradient: false,
                  } as const)

              const boundariesProps =
                props.boundaries && line.withBoundaries
                  ? {
                      boundaries: props.boundaries,
                      boundariesAxis: props.boundariesAxis,
                      boundariesGradientId,
                    }
                  : {}

              return (
                <LineWithDots
                  key={line.lineName}
                  values={[...line.values]}
                  color={line.color}
                  hasDotRadius={line.dots}
                  defaultDotRadius={dotRadius}
                  scaleX={scaleX}
                  scaleY={scaleY}
                  lineClipPath={lineClipPath}
                  dotsClipPath={dotsClipPath}
                  hoveredMainValue={hoveredMainValue}
                  isHorizontal={isHorizontal}
                  {...gradientProps}
                  {...boundariesProps}
                />
              )
            })}
            {props.boundaries && props.showBoundariesOnAxis && (
              <BoundariesAxisLine
                axis={props.boundariesAxis}
                isHorizontal={isHorizontal}
                xLabelsPos={xLabelsPos}
                yLabelsPos={yLabelsPos}
                boundariesGradientId={boundariesGradientId}
              />
            )}
          </svg>

          {withZoom && (
            <Zoom
              value={this.state.zoom}
              onChange={this.onZoom}
              isHorizontal={isHorizontal}
              paddingX={paddingX}
              paddingY={paddingY}
              xLabelsPos={xLabelsPos}
              yLabelsPos={yLabelsPos}
            />
          )}
        </div>
      </div>
    )
  }

  isXInverted = () => (this.props.directionX || DEFAULT_DIRECTION_X) === 'toLeft'
  isYInverted = () =>
    (this.props.directionY || getDefaultDirectionY(this.props.isHorizontal)) === 'toBottom'

  getXDomain = (items: readonly Item[]): NumberRange => {
    const {
      gridConfig: {
        x: { withPaddings },
      },
      isHorizontal,
    } = this.props
    const { zoom } = this.state
    const { left, right } = domainPaddings[isHorizontal ? 'horizontal' : 'vertical']

    return _.flow(
      () => d3.extent(items, v => v.x) as NumberRange,
      domain => (this.isXInverted() ? invertDomain(domain) : domain),
      domain => (isHorizontal ? zoomDomain(domain, zoom) : domain),
      domain =>
        padDomain({
          domain,
          paddingStart: withPaddings ? left : 0,
          paddingEnd: withPaddings ? right : 0,
          zoomScale: getZoomScale(zoom),
        })
    )()
  }

  getYDomain = (items: readonly Item[]): NumberRange => {
    const {
      gridConfig: {
        y: { withPaddings },
      },
      isHorizontal,
    } = this.props
    const { zoom } = this.state
    const { top, bottom } = domainPaddings[isHorizontal ? 'horizontal' : 'vertical']

    return _.flow(
      () => d3.extent(items, v => v.y) as NumberRange,
      domain => (this.isYInverted() ? invertDomain(domain) : domain),
      domain => (isHorizontal ? domain : zoomDomain(domain, zoom)),
      domain =>
        padDomain({
          domain,
          paddingStart: withPaddings ? bottom : 0,
          paddingEnd: withPaddings ? top : 0,
          zoomScale: getZoomScale(zoom),
        })
    )()
  }

  getThresholdLines = () => {
    const { threshold, isHorizontal } = this.props

    if (!threshold) {
      return []
    }

    const { max, min = { values: [] } } = threshold

    return [flipPointsOnAxes(max.values, isHorizontal), flipPointsOnAxes(min.values, isHorizontal)]
  }

  getAllThresholdValues = (): readonly Item[] => _.flatten(this.getThresholdLines())

  getLines = (): readonly Line[] => {
    const { lines, isHorizontal } = this.props

    return isHorizontal
      ? lines
      : lines.map(line => ({
          ...line,
          values: _.sortBy(flipPointsOnAxes(line.values, isHorizontal), 'y'),
        }))
  }

  getThreshold = (): Threshold | undefined => {
    const { threshold, isHorizontal } = this.props

    if (!threshold) {
      return undefined
    }

    return {
      max: {
        ...threshold.max,
        values: flipPointsOnAxes(threshold.max.values, isHorizontal),
      },
      min: threshold.min && {
        ...threshold.min,
        values: flipPointsOnAxes(threshold.min.values, isHorizontal),
      },
    }
  }

  getAllValues = (): readonly Item[] => _.flatten(this.getLines().map(l => l.values))

  getSvgSize = () => {
    const {
      state: { width, height, paddingX, paddingY },
    } = this

    return {
      svgWidth: Math.round(width - paddingX),
      svgHeight: Math.round(height - paddingY),
    }
  }

  getTicks = () => {
    const { isHorizontal, gridConfig } = this.props
    const { xDomain, yDomain } = this.state

    const mainGridConfig = gridConfig[isHorizontal ? 'x' : 'y']
    const secondaryGridConfig = gridConfig[isHorizontal ? 'y' : 'x']

    const mainGridTickValues = getMainTickValues({
      items: this.getAllValues(),
      domain: isHorizontal ? xDomain : yDomain,
      ticksCount: mainGridConfig.gridTicks,
      isHorizontal,
    })

    const secondaryGridTickValues = getSecondaryTickValues({
      items: this.getAllValues(),
      domain: isHorizontal ? yDomain : xDomain,
      ticksCount: secondaryGridConfig.gridTicks,
      isHorizontal,
    })

    return {
      mainGridTickValues,
      mainLabelTickValues: getEveryN(mainGridTickValues, mainGridConfig.labelTicks || 0),
      secondaryGridTickValues,
      secondaryLabelTickValues: getEveryN(
        secondaryGridTickValues,
        secondaryGridConfig.labelTicks || 0
      ),
    }
  }

  updateDomains() {
    const { zoom } = this.state

    /**
     * Включаем в расчеты значения из линий порога только при первоначальной
     * отрисовке или при изменениях данных с учетом того что зум равняется 1.
     */
    const linesValues = this.getAllValues()
    const thresholdValues = isDefaultZoom(zoom) ? this.getAllThresholdValues() : []
    const values: readonly Item[] = [...linesValues, ...thresholdValues]

    const xDomain = this.getXDomain(values)
    const yDomain = this.getYDomain(values)
    const [xGuideValue] = d3.extent(values, v => v.x) as NumberRange
    const [yGuideValue] = d3.extent(values, v => v.y) as NumberRange

    this.setState({
      xDomain,
      yDomain,
      xGuideValue,
      yGuideValue,
    })
  }

  updateSize = () => {
    const { width, height } = this.ref.current!.getBoundingClientRect()
    const newSize = { width, height }

    if (!_.isEqual(_.pick(this.state, ['width', 'height']), newSize)) {
      this.setState(newSize)
    }
  }

  onAxisSizeChange = ({ xAxisHeight, yAxisWidth }: { xAxisHeight: number; yAxisWidth: number }) => {
    const newPaddings = {
      paddingX: yAxisWidth,
      paddingY: xAxisHeight,
    }

    if (!_.isEqual(newPaddings, this.targetPaddings)) {
      this.targetPaddings = newPaddings

      const currentPaddings = _.pick(this.state, ['paddingX', 'paddingY'])

      if (!currentPaddings.paddingX || !currentPaddings.paddingY) {
        this.setState(newPaddings)
      } else {
        d3.select(this.paddingTransitionEl)
          .interrupt()
          .transition()
          .duration(TRANSITION_DURATIONS.SIZE)
          .tween('paddings', () => {
            const i = d3.interpolateObject(currentPaddings, newPaddings)

            return (t: number) => {
              this.setState({ ...i(t) })
            }
          })
      }
    }
  }

  getAxis = () => {
    const {
      state: { xDomain, yDomain },
      props: { isHorizontal },
    } = this
    const setXDomain = (domain: NumberRange) => this.setState({ xDomain: domain })
    const setYDomain = (domain: NumberRange) => this.setState({ yDomain: domain })

    return isHorizontal
      ? {
          main: {
            currentDomain: xDomain,
            getDomain: this.getXDomain,
            setDomain: setXDomain,
            getValue: (v: NotEmptyItem) => v.x,
          },
          secondary: {
            currentDomain: yDomain,
            getDomain: this.getYDomain,
            setDomain: setYDomain,
            isInverted: this.isYInverted(),
          },
        }
      : {
          main: {
            currentDomain: yDomain,
            getDomain: this.getYDomain,
            setDomain: setYDomain,
            getValue: (v: NotEmptyItem) => v.y,
          },
          secondary: {
            currentDomain: xDomain,
            getDomain: this.getXDomain,
            setDomain: setXDomain,
            isInverted: this.isXInverted(),
          },
        }
  }

  onZoom = (newZoom: ZoomState) => {
    this.setState({ zoom: newZoom }, () => {
      const { main: mainAxis, secondary: secondaryAxis } = this.getAxis()
      const newMainDomain = mainAxis.getDomain(this.getAllValues())

      if (!_.isEqual(mainAxis.currentDomain, newMainDomain)) {
        mainAxis.setDomain(newMainDomain)
      }

      /**
       * Включаем в расчет домена значения из линий порогов только если зум
       * возвращается к стандартному значению.
       */
      const secondaryDomainValues = [
        ...this.getLines().map(item => item.values),
        ...(isDefaultZoom(newZoom) ? this.getThresholdLines() : []),
      ].filter(item => item.length)

      const newSecondaryDomain = calculateSecondaryDomain({
        mainDomainMin: Math.min(...newMainDomain),
        mainDomainMax: Math.max(...newMainDomain),
        linesValues: secondaryDomainValues,
        getValue: mainAxis.getValue,
        getDomain: secondaryAxis.getDomain,
        isInverted: secondaryAxis.isInverted,
      })

      if (!_.isEqual(newSecondaryDomain, this.targetSecondaryDomain)) {
        this.targetSecondaryDomain = newSecondaryDomain

        d3.select(this.secondaryDomainTransitionEl)
          .transition()
          .duration(TRANSITION_DURATIONS.ZOOM)
          .tween('secondaryDomainTween', () => {
            const i = d3.interpolateArray([...secondaryAxis.currentDomain], [...newSecondaryDomain])

            return (t: number) => {
              // убеждаемся, что setDomain получит на входе массив с нужной длиной
              secondaryAxis.setDomain([i(t)[0], i(t)[1]] as NumberRange)
            }
          })
      }
    })
  }

  setHoveredMainValue = (newValue: HoveredMainValue) =>
    this.setState({ hoveredMainValue: newValue })
}
