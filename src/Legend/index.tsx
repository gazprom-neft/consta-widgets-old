import React from 'react'

import classnames from 'classnames'

import { Title } from '@/_private/components/Title'
import { LabelPosition, LabelType, LegendItem, Size } from '@/LegendItem'

import css from './index.css'

export const directions = ['column', 'row'] as const
export type Direction = typeof directions[number]

export type Item = {
  text: string
  color: string
}
export type Data = readonly Item[]

type Props = {
  data: Data
  direction: Direction
  labelType: LabelType
  fontSize: Size
  labelPosition: LabelPosition
  lineBold?: boolean
  title?: React.ReactNode
  onItemMouseEnter?: (item: Item) => void
  onItemMouseLeave?: (item: Item) => void
}

export const Legend: React.FC<Props> = ({
  direction,
  data,
  labelType,
  labelPosition,
  lineBold,
  fontSize,
  title,
  onItemMouseEnter,
  onItemMouseLeave,
}) => {
  return (
    <div
      className={classnames(
        css.main,
        onItemMouseEnter && css.isHoverable,
        direction === 'column' && css.column
      )}
    >
      <Title className={css.title}>{title}</Title>
      {data.map(item => (
        <LegendItem
          color={item.color}
          key={item.text}
          className={css.item}
          fontSize={fontSize}
          type={labelType}
          position={labelPosition}
          lineBold={lineBold}
          shouldCropText
          onMouseEnter={onItemMouseEnter ? () => onItemMouseEnter(item) : undefined}
          onMouseLeave={onItemMouseLeave ? () => onItemMouseLeave(item) : undefined}
        >
          {item.text}
        </LegendItem>
      ))}
    </div>
  )
}
