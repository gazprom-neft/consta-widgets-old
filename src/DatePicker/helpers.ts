import { isDefined } from '@consta/widgets-utils/lib/type-guards'
import { format, isWithinInterval } from 'date-fns'
import ruLocale from 'date-fns/locale/ru'

import { DateLimitProps, DateRange, ValueProps } from './'
import { isDateFromInputIsFullyEntered } from './components/InputDate/helpers'

export const isDateRange: (value: ValueProps<Date | DateRange>['value']) => value is DateRange = (
  value
): value is DateRange =>
  Array.isArray(value) &&
  value.length === 2 &&
  value.every(date => date instanceof Date || !isDefined(date))

export const getCurrentVisibleDate = ({
  value,
  minDate,
  maxDate,
}: ValueProps<Date | DateRange> & DateLimitProps): Date => {
  const selectedDate = (isDateRange(value) ? value[1] || value[0] : value) || new Date()

  if (selectedDate > maxDate) {
    return maxDate
  }

  if (selectedDate < minDate) {
    return minDate
  }

  return selectedDate
}

export const getMonthTitle = (date: Date) => {
  return format(date, 'LLLL', { locale: ruLocale })
}

export const isDateOutOfRange = ({
  date,
  minDate,
  maxDate,
}: {
  date?: Date
} & DateLimitProps) => {
  return !!date && !isWithinInterval(date, { start: minDate, end: maxDate })
}

export const isDateIsInvalid = ({
  date,
  minDate,
  maxDate,
}: {
  date?: Date
} & DateLimitProps) => {
  return (
    !!date &&
    isDateFromInputIsFullyEntered(date) &&
    isDateOutOfRange({
      date,
      minDate,
      maxDate,
    })
  )
}

export const isOnlyOneDateInRange = (range: DateRange) => {
  return Boolean((range[0] && !range[1]) || (!range[0] && range[1]))
}

export const isDateFullyEntered = (value: Date | DateRange) => {
  if (!isDateRange(value)) {
    return isDateFromInputIsFullyEntered(value)
  }

  if (value[0] && !value[1]) {
    return isDateFromInputIsFullyEntered(value[0])
  }

  if (value[1] && !value[0]) {
    return isDateFromInputIsFullyEntered(value[1])
  }

  return (
    !!value[0] &&
    isDateFromInputIsFullyEntered(value[0]) &&
    !!value[1] &&
    isDateFromInputIsFullyEntered(value[1])
  )
}
