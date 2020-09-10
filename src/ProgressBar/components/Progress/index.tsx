import React from 'react'

import { isNotNil } from '@consta/widgets-utils/lib/type-guards'
import classnames from 'classnames'

import { getValueRatio, Size } from '../../'

import css from './index.css'

export type Data = {
  value: number | null
  valueMin: number
  valueMax: number
}

export type Props = {
  data: Data
  size: Size
  color: string
}

const sizeClasses: Record<Size, string> = {
  xs: css.sizeXS,
  s: css.sizeS,
  m: css.sizeM,
  l: css.sizeL,
}

export const Progress: React.FC<Props> = ({ data: { value, valueMin, valueMax }, color, size }) => {
  const isWithData = isNotNil(value)
  const valueNowRatio = getValueRatio({ value: value || 0, valueMin, valueMax })
  const progressIsNotFull = valueNowRatio < 100

  return (
    <progress
      max={100}
      value={valueNowRatio}
      className={classnames(
        css.progress,
        isWithData && css.isWithData,
        isWithData && progressIsNotFull && css.isNotFull,
        sizeClasses[size]
      )}
      style={{ color }}
      aria-valuemin={valueMin}
      aria-valuenow={value || 0}
      aria-valuemax={valueMax}
    />
  )
}
