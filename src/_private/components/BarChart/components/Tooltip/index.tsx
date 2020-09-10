import * as React from 'react'

import { isNotNil } from '@consta/widgets-utils/lib/type-guards'
import { Tooltip as BaseTooltip } from '@gpn-design/uikit/Tooltip'

import { TooltipContentForMultipleValues } from '@/_private/components/TooltipContentForMultipleValues'
import { FormatValue } from '@/_private/types'

import { SectionItem } from '../Column'

export type TooltipData = {
  x: number
  y: number
  sections: readonly SectionItem[]
}

type Props = {
  data: TooltipData
  isHorizontal: boolean
  formatValue?: FormatValue
}

const sectionHasValue = (
  section: SectionItem
): section is SectionItem & { value: NonNullable<SectionItem['value']> } => isNotNil(section.value)

export const Tooltip: React.FC<Props> = ({ data, isHorizontal, formatValue = String }) => {
  return (
    <BaseTooltip
      size="s"
      position={{ x: data.x, y: data.y }}
      direction={isHorizontal ? 'upCenter' : 'leftCenter'}
      isInteractive={false}
    >
      <TooltipContentForMultipleValues
        items={data.sections.filter(sectionHasValue).map(section => ({
          value: section.value,
          color: section.color,
        }))}
        formatValueForTooltip={formatValue}
      />
    </BaseTooltip>
  )
}
