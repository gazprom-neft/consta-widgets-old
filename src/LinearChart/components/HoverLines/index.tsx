import React from 'react'

import { isDefined, isNotNil } from '@consta/widgets-utils/lib/type-guards'
import classnames from 'classnames'
import * as _ from 'lodash'

import { HoveredMainValue, Line, ScaleLinear } from '../../'

import css from './index.css'

export type Function = (newValue: HoveredMainValue) => void

type Props = {
  lines: readonly Line[]
  width: number
  height: number
  isHorizontal: boolean
  scaleX: ScaleLinear
  scaleY: ScaleLinear
  hoveredMainValue: HoveredMainValue
  onChangeHoveredMainValue: Function
  onClickLine?: (value: number) => void
}

type LineProps = {
  position: Position
  lineClassName: string | boolean
  value?: number
  onHover: Function
  onClick?: () => void
}

type Position = {
  x1: number
  y1: number
  x2: number
  y2: number
}

const HoverLine: React.FC<LineProps> = ({ position, lineClassName, value, onHover, onClick }) => {
  const { x1, y1, x2, y2 } = position

  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      className={classnames(css.hoverLine, lineClassName)}
      onMouseLeave={() => onHover(undefined)}
      onMouseEnter={() => onHover(value)}
      onClick={onClick}
    />
  )
}

export const HoverLines: React.FC<Props> = ({
  scaleX,
  scaleY,
  lines,
  height,
  width,
  isHorizontal,
  hoveredMainValue,
  onChangeHoveredMainValue,
  onClickLine,
}) => {
  const mainValueKey = isHorizontal ? 'x' : 'y'
  const lineValues = _.uniqBy(_.flatten(lines.map(l => l.values)), v => v[mainValueKey])

  return (
    <g>
      {lineValues
        .map((lineValue, index) => {
          const mainValue = lineValue[mainValueKey]

          if (!isNotNil(mainValue)) {
            return
          }

          const position = isHorizontal
            ? {
                x1: scaleX(mainValue),
                y1: 0,
                x2: scaleX(mainValue),
                y2: height,
              }
            : {
                x1: 0,
                y1: scaleY(mainValue),
                x2: width,
                y2: scaleY(mainValue),
              }
          const isActive = mainValue === hoveredMainValue
          const commonProps = {
            position,
            value: mainValue,
            onHover: onChangeHoveredMainValue,
            onClick: onClickLine ? () => onClickLine(mainValue) : undefined,
          }

          return (
            <React.Fragment key={index}>
              <HoverLine {...commonProps} lineClassName={css.isHoverable} />
              <HoverLine {...commonProps} lineClassName={isActive && css.isActive} />
            </React.Fragment>
          )
        })
        .filter(isDefined)}
    </g>
  )
}
