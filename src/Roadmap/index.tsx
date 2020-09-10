import React, { useCallback, useState } from 'react'

import { isDefined } from '@consta/widgets-utils/lib/type-guards'
import { useComponentSize } from '@gpn-design/uikit/useComponentSize'
import { Position } from '@gpn-design/uikit/Popover'
import { Table, TableColumn, TableFilters, TableRow } from '@gpn-design/uikit/Table'
import classnames from 'classnames'

import { MonthsTitles } from '@/Roadmap/components/MonthsTitles'

import { GroupLines } from './components/GroupLines'
import { getXCoordByDate, MONTH_NAMES } from './helpers'
import css from './index.css'

export type Item = {
  startDate: number
  endDate: number
}

export type Group = {
  color: string
  title?: string
  plan?: Item
  fact?: Item
  forecast?: Item
  comment?: string
}

export type RoadmapRow = TableRow & {
  groups: readonly Group[]
}

export type Props = {
  columns: ReadonlyArray<TableColumn<TableRow>>
  rows: readonly RoadmapRow[]
  currentDay: number
  startDate: number
  endDate: number
  filters?: TableFilters<TableRow>
}

type ActiveRowState = {
  id?: string
  groupIndex?: number
  position: Position
}

export type MonthItem = {
  value: typeof MONTH_NAMES[number]
  year: number
  period?: string
}

export const Roadmap: React.FC<Props> = ({
  currentDay,
  rows,
  columns,
  startDate,
  endDate,
  filters,
}) => {
  const firstMonthRef = React.useRef(null)
  const { width: monthWidth } = useComponentSize(firstMonthRef)
  const [activeRow, changeActiveRow] = useState<ActiveRowState>({
    id: undefined,
    groupIndex: undefined,
    position: undefined,
  })
  const isGroupActive = (rowId: string, groupIndex: number) =>
    activeRow.id === rowId && activeRow.groupIndex === groupIndex
  const isAnyRowActive = isDefined(activeRow.id) && isDefined(activeRow.groupIndex)

  const resetActiveLine = useCallback(
    () =>
      changeActiveRow({
        id: undefined,
        groupIndex: undefined,
        position: undefined,
      }),
    [changeActiveRow]
  )

  const handleLineClick = ({
    event,
    id,
    groupIndex,
  }: {
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
    id: string
    groupIndex: number
  }) => {
    if (!isGroupActive(id, groupIndex) && event.target instanceof Element) {
      const position = {
        x: event.clientX,
        y: event.target.getBoundingClientRect().top,
      }

      changeActiveRow({ id, groupIndex, position })
    }
  }

  const mutableTableColumns: Array<TableColumn<TableRow>> = [
    ...columns,
    {
      title: <MonthsTitles startDate={startDate} endDate={endDate} firstMonthRef={firstMonthRef} />,
      accessor: 'lines',
      withoutPadding: true,
    },
  ]

  const currentDayX = getXCoordByDate({
    startDate: currentDay,
    monthWidth,
    graphStartDate: startDate,
  })

  const tableRows = rows.map(({ id, groups, ...rowColumns }, rowIdx) => {
    const lines = groups.map((group, groupIndex) => (
      <GroupLines
        key={`${id}-${groupIndex}`}
        graphStartDate={startDate}
        group={group}
        monthWidth={monthWidth}
        isActive={isGroupActive(id, groupIndex)}
        isAnyRowActive={isAnyRowActive}
        withMargin={groupIndex !== 0}
        tooltipPosition={activeRow.position}
        onClick={event => handleLineClick({ event, id, groupIndex })}
        onTooltipRequestClose={resetActiveLine}
      />
    ))

    return {
      ...rowColumns,
      id,
      lines: (
        <div className={css.linesCell} style={{ backgroundSize: `${monthWidth}px 20px` }}>
          <div className={css.linesWrapper}>{lines}</div>
          <div
            className={classnames(css.currentDay, rowIdx === 0 && css.withCircle)}
            style={{ left: currentDayX }}
          />
        </div>
      ),
    }
  })

  return (
    <div className={css.main}>
      <Table<TableRow>
        columns={mutableTableColumns}
        rows={tableRows}
        filters={filters}
        stickyColumns={columns.length}
        size="l"
        borderBetweenColumns
        isZebraStriped
      />
    </div>
  )
}
