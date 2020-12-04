import React from 'react'

import classnames from 'classnames'

import {
  Axis,
  Boundary,
  DirectionX,
  DirectionY,
  HoveredMainValue,
  Item,
  itemIsNotEmpty,
  ScaleLinear,
} from '../..'
import { getBoundary } from '../../helpers'
import { Area } from '../Area'
import { Line } from '../Line'

import css from './index.css'

type GradientProps =
  | {
      withGradient: false
    }
  | {
      withGradient: true
      gradientDirectionX: DirectionX
      gradientDirectionY: DirectionY
      areaBottom: number
    }

type BoundariesProps =
  | {
      boundaries?: never
    }
  | {
      boundaries: readonly Boundary[]
      boundariesAxis: Axis
      boundariesGradientId: string
    }

type Props = {
  values: readonly Item[]
  color: string
  hasDotRadius?: boolean
  defaultDotRadius: number
  lineClipPath: string
  dotsClipPath: string
  scaleX: ScaleLinear
  scaleY: ScaleLinear
  hoveredMainValue: HoveredMainValue
  isHorizontal: boolean
  showValues?: boolean
} & GradientProps &
  BoundariesProps

const isActiveCircle = (position: Item, isHorizontal: boolean, activeValue?: number) => {
  return (isHorizontal ? position.x : position.y) === activeValue
}

export const LINE_WIDTH = 2

export const LineWithDots: React.FC<Props> = props => {
  const {
    values,
    color,
    hasDotRadius,
    defaultDotRadius,
    scaleX,
    scaleY,
    lineClipPath,
    dotsClipPath,
    hoveredMainValue,
    isHorizontal,
    showValues,
  } = props

  return (
    <g className={css.main}>
      <g clipPath={lineClipPath}>
        <Line
          points={values}
          scaleX={scaleX}
          scaleY={scaleY}
          stroke={props.boundaries ? `url(#${props.boundariesGradientId})` : color}
          strokeWidth={LINE_WIDTH}
        />

        {props.withGradient && (
          <Area
            values={values.filter(itemIsNotEmpty)}
            color={color}
            scaleX={scaleX}
            scaleY={scaleY}
            isHorizontal={isHorizontal}
            areaBottom={props.areaBottom}
            directionX={props.gradientDirectionX}
            directionY={props.gradientDirectionY}
          />
        )}
      </g>

      <g clipPath={dotsClipPath}>
        {values.filter(itemIsNotEmpty).map((item, idx, items) => {
          const isActive = isActiveCircle(item, isHorizontal, hoveredMainValue)
          const radius = hasDotRadius || isActive || items.length === 1 ? defaultDotRadius : 0
          const radiusCircle = isActive ? radius * 2 : radius
          const boundaryColor =
            props.boundaries &&
            getBoundary({
              axis: props.boundariesAxis,
              boundaries: props.boundaries,
              item,
              isHorizontal,
            })?.color
          const circleColor = boundaryColor || color

          return (
            <circle
              key={idx}
              cx={scaleX(item.x)}
              cy={scaleY(item.y)}
              r={radiusCircle}
              className={classnames(css.circle, isActive && css.isActive)}
              style={{
                strokeWidth: radiusCircle,
              }}
              color={circleColor}
            />
          )
        })}
      </g>
      {showValues && (
        <g clipPath={dotsClipPath}>
          {values.filter(itemIsNotEmpty).map((item, idx) => {
            return (
              <text
                key={idx}
                x={scaleX(item.x)}
                y={scaleY(item.y)}
                className={classnames(css.label, isHorizontal && css.isHorizontal)}
                text-anchor={isHorizontal ? 'middle' : 'start'}
              >
                {isHorizontal ? item.y : item.x}
              </text>
            )
          })}
        </g>
      )}
    </g>
  )
}
