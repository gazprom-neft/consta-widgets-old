import React from 'react'

import { isDefined } from '@consta/widgets-utils/lib/type-guards'
import { Text } from '@gpn-design/uikit/Text'
import { Tooltip } from '@gpn-design/uikit/Tooltip'
import * as _ from 'lodash'

import { TooltipContentForMultipleValues } from '@/_private/components/TooltipContentForMultipleValues'
import { FormatValue } from '@/_private/types'
import { getFormattedValue } from '@/_private/utils/chart'

import { Axis, ExtendedFigure } from '../..'

type Props = {
  extendedFigures: readonly ExtendedFigure[]
  axis: Axis
  formatValue?: FormatValue
  anchorEl: Element
}

export const AxisTooltip: React.FC<Props> = ({ extendedFigures, axis, formatValue, anchorEl }) => {
  const pointsOnAxis = extendedFigures
    .map(f => f.points.find(p => p.axisName === axis.name))
    .filter(isDefined)
  const itemWithMaxValue = _.maxBy(pointsOnAxis, item => item.originalValue || 0)

  if (!itemWithMaxValue) {
    return null
  }

  const { top, left, width, height } = anchorEl.getBoundingClientRect()
  const x = (width / 100) * itemWithMaxValue.xPercent + left
  const y = (height / 100) * itemWithMaxValue.yPercent + top

  return (
    <Tooltip size="l" position={{ x, y }} isInteractive={false}>
      {extendedFigures.length === 1 ? (
        <Text size="xs">{getFormattedValue(pointsOnAxis[0].originalValue, formatValue)}</Text>
      ) : (
        <TooltipContentForMultipleValues
          title={axis.label}
          items={extendedFigures.map((f, idx) => ({
            name: f.name,
            color: f.color,
            value: pointsOnAxis[idx].originalValue,
          }))}
          formatValueForTooltip={formatValue}
        />
      )}
    </Tooltip>
  )
}
