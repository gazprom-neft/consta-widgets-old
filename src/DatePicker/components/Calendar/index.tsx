import React from 'react'

import { isDefined } from '@consta/widgets-utils/lib/type-guards'
import { Text } from '@gpn-design/uikit/Text'
import classnames from 'classnames'
import {
  addDays,
  addMonths,
  differenceInDays,
  endOfMonth,
  endOfWeek,
  isBefore,
  isSameDay,
  isSunday,
  isToday,
  isWithinInterval,
  startOfMonth,
  startOfWeek,
} from 'date-fns'
import * as _ from 'lodash'

import { DateLimitProps, DateRange, ValueProps } from '../../'
import { getMonthTitle, isDateRange, isOnlyOneDateInRange } from '../../helpers'

import css from './index.css'

type Props = {
  currentVisibleDate: Date
  onSelect: (value: Date | DateRange) => void
} & ValueProps<Date | DateRange> &
  DateLimitProps

const getStartAndEndDate = (date1: Date, date2: Date) => {
  const [start, end] = _.sortBy([date1, date2])

  return { start, end }
}

export const isDateHighlighted = ({
  date,
  value,
  hoveredDate,
}: {
  date: Date
  hoveredDate?: Date
} & ValueProps<Date | DateRange>) => {
  if (!hoveredDate || !isDateRange(value) || !isOnlyOneDateInRange(value)) {
    return false
  }

  const [startDate, endDate] = value

  if (isDefined(startDate)) {
    return isWithinInterval(date, getStartAndEndDate(startDate, hoveredDate))
  }

  if (isDefined(endDate)) {
    return isWithinInterval(date, getStartAndEndDate(endDate, hoveredDate))
  }

  return false
}

const isDateSelected = ({
  date,
  value,
}: {
  date: Date
} & ValueProps<Date>) => {
  return value ? isSameDay(value, date) : false
}

export const isValueSelected = ({ date, value }: { date: Date; value?: Date | DateRange }) => {
  if (isDateRange(value)) {
    if (value[0] && value[1]) {
      const { start, end } = getStartAndEndDate(value[0], value[1])
      return isWithinInterval(date, { start, end })
    }

    return isDateSelected({ date, value: value[0] || value[1] })
  } else {
    return isDateSelected({ date, value })
  }
}

export const isValueSelectedBackwards = ({
  value,
  hoveredDate,
}: {
  value?: Date | DateRange
  hoveredDate?: Date
}) => {
  return (
    hoveredDate &&
    isDateRange(value) &&
    isOnlyOneDateInRange(value) &&
    ((isDefined(value[0]) && isBefore(hoveredDate, value[0])) ||
      (isDefined(value[1]) && isBefore(hoveredDate, value[1])))
  )
}

const getMonthWeeks = (date: Date) => {
  const currentMonth = date.getMonth()
  const startDate = startOfWeek(startOfMonth(date), { weekStartsOn: 1 })
  const endDate = endOfWeek(endOfMonth(date), { weekStartsOn: 1 })
  const diffDays = differenceInDays(endDate, startDate) + 1

  const days = _.times(diffDays).map((__, index) => {
    const day = addDays(startDate, index)

    if (day.getMonth() === currentMonth) {
      return day
    }

    return
  })

  return _.chunk(days, 7)
}

const weekDays = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'].map((dayName, idx) => (
  <div key={idx} className={classnames(css.cell, css.isWeekDay)}>
    <div className={css.cellContent}>
      <Text as="span" size="2xs" transform="uppercase" view="ghost" spacing="xs">
        {dayName}
      </Text>
    </div>
  </div>
))

export const Calendar: React.FC<Props> = ({
  onSelect,
  value,
  currentVisibleDate,
  minDate,
  maxDate,
}) => {
  const [hoveredDate, setHoveredDate] = React.useState<Date>()

  const handleHoverDate = (date: Date) => {
    if (isWithinInterval(date, { start: minDate, end: maxDate })) {
      return setHoveredDate(date)
    }

    return setHoveredDate(undefined)
  }

  const handleSelectDate = (date: Date) => {
    if (!isWithinInterval(date, { start: minDate, end: maxDate })) {
      return
    }

    if (!isDateRange(value)) {
      return onSelect(date)
    }

    if (!isOnlyOneDateInRange(value)) {
      return onSelect([date, undefined])
    }

    const [startDate, endDate] = value

    if (isDefined(startDate)) {
      return onSelect(startDate > date ? [date, startDate] : [startDate, date])
    }

    if (isDefined(endDate)) {
      return onSelect(endDate > date ? [date, endDate] : [endDate, date])
    }
  }

  const monthsAmount = isDateRange(value) ? 2 : 1

  const renderDay = (date: Date | undefined, dayIdx: number) => {
    if (!date) {
      return (
        <div key={dayIdx} className={css.cell}>
          <div className={css.cellContent} />
        </div>
      )
    }

    const isDateToday = isToday(date)
    const isDisabled = !isWithinInterval(date, { start: minDate, end: maxDate })
    const isHighlighted = isDateHighlighted({ date, value, hoveredDate })
    const isSelected = isValueSelected({ date, value })
    const isSelectedBackwards = isValueSelectedBackwards({ value, hoveredDate })
    const [firstDate, lastDate] = isDateRange(value) ? _.sortBy(value) : [undefined, undefined]
    const isFirstDate = isDateRange(value) && firstDate ? isSameDay(firstDate, date) : false
    const isLastDate = isDateRange(value) && lastDate ? isSameDay(lastDate, date) : false

    return (
      <div
        key={dayIdx}
        className={classnames(
          css.cell,
          isDateToday && css.isToday,
          isDisabled ? css.isDisabled : css.isSelectable,
          isSelected && css.isSelected,
          isFirstDate && css.isFirstDate,
          isLastDate && css.isLastDate,
          isSelectedBackwards && css.isSelectedBackwards,
          !isDateRange(value) && css.isSingleDate,
          isDateRange(value) && css.isRange,
          isDateRange(value) && isHighlighted && css.isHighlighted,
          isDateRange(value) && isOnlyOneDateInRange(value) && css.isOnlyOneValue,
          isDateRange(value) && isSunday(date) && css.isLastWeekDay
        )}
        onMouseEnter={() => handleHoverDate(date)}
        onMouseLeave={() => setHoveredDate(undefined)}
        onClick={() => handleSelectDate(date)}
      >
        <div className={css.cellContent}>
          <Text as="span" size="s" className={css.cellContentText}>
            {date.getDate()}
          </Text>
        </div>
      </div>
    )
  }

  return (
    <div className={classnames(css.main)}>
      {_.times(monthsAmount, idx => {
        const month = addMonths(currentVisibleDate, idx)
        const weeks = getMonthWeeks(month)

        return (
          <div key={idx} className={css.month}>
            {isDateRange(value) && (
              <Text
                as="div"
                size="s"
                weight="bold"
                transform="uppercase"
                view="primary"
                spacing="xs"
                className={css.title}
              >
                {getMonthTitle(month)}
              </Text>
            )}
            <div className={classnames(css.row, css.isWithDaynames)}>{weekDays}</div>
            <div className={css.weeks}>
              {weeks.map((week, weekIdx) => (
                <div key={weekIdx} className={css.row}>
                  {week.map(renderDay)}
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
