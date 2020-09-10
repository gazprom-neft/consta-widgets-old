import React from 'react'

import { isDefined, isNotNil } from '@consta/widgets-utils/lib/type-guards'
import _ from 'lodash'

import { FormatValue } from '@/_private/types'
import { Scaler } from '@/_private/utils/scale'

import { Column } from './components/Column'
import { RenderColumn, RenderSection } from './components/Group'
import { Section } from './components/Section'
import { Position, Ticks } from './components/Ticks'
import { Size, toAxisSize } from './helpers'

export const defaultRenderColumn: RenderColumn = props => <Column {...props} />

export const defaultRenderSection: RenderSection = props => {
  if (props.length === undefined) {
    return null
  }

  const isRounded = props.columnSize !== 's' && !props.isDense && props.isLast
  const isColumnLabel = props.showValues && props.isLast
  const isSectionLabel =
    _.isNumber(props.activeSectionIndex) && props.activeSectionIndex === props.index
  const isActive =
    isSectionLabel ||
    (props.activeGroup && props.activeGroup === props.group) ||
    (!props.activeGroup && !_.isNumber(props.activeSectionIndex))

  const getLabel = () => {
    if (isColumnLabel && isNotNil(props.columnTotal)) {
      return props.formatValueForLabel(props.columnTotal)
    }

    if (isSectionLabel && isNotNil(props.value)) {
      return props.formatValueForLabel(props.value)
    }
  }

  return (
    <Section
      isActive={isActive}
      isRounded={isRounded}
      color={props.color}
      isHorizontal={props.isHorizontal}
      onMouseLeave={props.onMouseLeaveSection}
      onMouseMove={event => {
        if (!(event.currentTarget instanceof HTMLElement)) {
          return
        }

        const children = event.currentTarget.parentElement?.children || []
        const { left, top } = children[
          props.isHorizontal ? 0 : children.length - 1
        ].getBoundingClientRect()
        const { width, height } = Array.from(children).reduce(
          (prev, element) =>
            props.isHorizontal
              ? {
                  width: prev.width + element.getBoundingClientRect().width,
                  height: element.getBoundingClientRect().height,
                }
              : {
                  width: element.getBoundingClientRect().width,
                  height: prev.height + element.getBoundingClientRect().height,
                },
          { width: 0, height: 0 }
        )

        const x = left + width / 2
        const y = top + height / 2
        const selectedSections = props.sections.filter(isDefined)

        props.onMouseEnterSection({
          x,
          y,
          sections: props.isHorizontal ? selectedSections : [...selectedSections].reverse(),
        })
      }}
      isReversed={props.isReversed}
      length={props.length}
      label={getLabel()}
      onChangeLabelSize={props.onChangeLabelSize}
    />
  )
}

export type RenderGroupsLabels = (props: {
  values: readonly string[]
  position: Position
  size: Size
  isDense: boolean
  getGridAreaName: (index: number) => string
}) => React.ReactNode

export const defaultRenderGroupsLabels: RenderGroupsLabels = ({ size, ...rest }) => {
  return <Ticks {...rest} isLabel size={toAxisSize(size)} showLine />
}

export type RenderAxisValues = (props: {
  values: readonly number[]
  scaler: Scaler<number>
  position: Position
  size: Size
  isDense: boolean
  formatValueForLabel?: FormatValue
}) => React.ReactNode

export const defaultRenderAxisValues: RenderAxisValues = ({ size, ...rest }) => {
  return <Ticks {...rest} size={toAxisSize(size)} showLine />
}
