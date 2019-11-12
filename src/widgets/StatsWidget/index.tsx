import * as React from 'react'

import { Stats } from '@/components/Stats'
import { Size, sizes } from '@/components/Stats'
import { WidgetSettingsItem } from '@/components/WidgetSettingsItem'
import { DataMap, DataType } from '@/dashboard/types'
import { Status, statuses } from '@/ui/Badge'
import { createWidget, WidgetContentProps } from '@/utils/WidgetFactory'

const dataType = DataType.Stats
type Data = DataMap[typeof dataType]

const widgetId = '506fa3ba-e016-4b94-9ad3-547f7e70c464'

export const topTypes = ['label', 'sublabel'] as const
export type TopTypes = typeof topTypes[number]

export const positionNames = ['right', 'bottom'] as const
export type PositionNames = typeof positionNames[number]

type Params = {
  badgePosition: PositionNames
  topStyles: string
  size: Size
  top: string
  statusBadge: Status
}

export const defaultParams: Params = {
  badgePosition: 'right',
  topStyles: 'label',
  size: 'xs',
  top: 'сроки',
  statusBadge: 'normal',
}

export const StatsWidgetContent: React.FC<WidgetContentProps<Data, Params>> = ({
  data,
  params: { badgePosition, topStyles, size, top, statusBadge },
}) => {
  const { percent, bottomUnit, rightUnit } = data
  const rightValue = percent && badgePosition === 'right' ? percent : rightUnit
  const bottomValue = percent && badgePosition === 'bottom' ? percent : bottomUnit

  return (
    <Stats
      size={size}
      top={top}
      topSublabel={topStyles === 'sublabel'}
      right={rightValue}
      rightBadge={badgePosition === 'right'}
      bottom={bottomValue}
      bottomBadge={badgePosition === 'bottom'}
      statusBadge={statusBadge}
      number={data.number}
    />
  )
}

export const StatsWidget = createWidget<Data, Params>({
  id: widgetId,
  name: 'Статы',
  defaultParams,
  dataType,
  Content: StatsWidgetContent,
  renderSettings(params, onChangeParam) {
    return (
      <>
        <WidgetSettingsItem name="Размер">
          <select value={params.size} onChange={e => onChangeParam('size', e.target.value as Size)}>
            {sizes.map(size => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </WidgetSettingsItem>
        <WidgetSettingsItem name="Текст верхней строки">
          <input
            type="text"
            value={params.top}
            onChange={e => onChangeParam('top', e.target.value)}
          />
        </WidgetSettingsItem>
        <WidgetSettingsItem name="Вверхняя строка подзаголовок?">
          <select
            value={params.topStyles}
            onChange={e => onChangeParam('topStyles', e.target.value as TopTypes)}
          >
            {topTypes.map(type => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </WidgetSettingsItem>
        <WidgetSettingsItem name="Позиция Badge">
          <select
            value={params.badgePosition}
            onChange={e => onChangeParam('badgePosition', e.target.value as PositionNames)}
          >
            {positionNames.map(position => (
              <option key={position} value={position}>
                {position}
              </option>
            ))}
          </select>
        </WidgetSettingsItem>
        <WidgetSettingsItem name="Статус Badge">
          <select
            value={params.statusBadge}
            onChange={e => onChangeParam('statusBadge', e.target.value as Status)}
          >
            {statuses.map(status => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </WidgetSettingsItem>
      </>
    )
  },
})
