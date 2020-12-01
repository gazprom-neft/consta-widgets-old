import React from 'react'

import { Text, TextPropSize } from '@consta/uikit/Text'
import { isNotNil } from '@consta/widgets-utils/lib/type-guards'
import classnames from 'classnames'

import { Title } from '@/_private/components/Title'
import { Legend, Tick } from '@/ProgressBar/components/Legend'

import { Data as ProgressData, Progress } from './components/Progress'
import css from './index.css'

export type Data = ProgressData & {
  ticks?: readonly Tick[]
  summary: string | number
  color: string
  caption?: React.ReactNode
}

export type Size = 'xs' | 's' | 'm' | 'l'

type Props = {
  size?: Size
  data: readonly Data[]
  title?: React.ReactNode
}

export const getValueRatio = ({
  value,
  valueMin,
  valueMax,
}: {
  value: number
  valueMin: number
  valueMax: number
}) => {
  return ((value - valueMin) / (valueMax - valueMin)) * 100
}

const summarySizes: Record<Size, TextPropSize> = {
  xs: 's',
  s: 'l',
  m: '2xl',
  l: '2xl',
}

export const ProgressBar: React.FC<Props> = ({ size = 'm', data, title }) => {
  return (
    <div>
      <Title>{title}</Title>
      <div className={classnames(css.progressBar, size === 'xs' && css.sizeXS)}>
        {data.map((dataItem, i) => {
          const { caption, color, value, summary, ticks = [], valueMin, valueMax } = dataItem

          return (
            <div className={css.item} key={i}>
              {caption && (
                <div className={css.row}>
                  <div className={classnames(css.cell, css.isTitleCell)}>{caption}</div>
                </div>
              )}

              <div className={css.row}>
                <div className={classnames(css.cell, css.isProgressCell)}>
                  <Progress data={dataItem} color={color} size={size} />
                </div>
                <div className={classnames(css.cell, css.isValueCell)} style={{ color }}>
                  <Text as="div" size={summarySizes[size]} className={css.cellText}>
                    {isNotNil(value) ? summary : '–'}
                  </Text>
                </div>
              </div>

              {ticks.length ? (
                <div className={css.row}>
                  <div className={classnames(css.cell, css.isTicksCell)}>
                    <Legend ticks={ticks} valueMin={valueMin} valueMax={valueMax} />
                  </div>
                  <div className={css.cell} />
                </div>
              ) : null}
            </div>
          )
        })}
      </div>
    </div>
  )
}
