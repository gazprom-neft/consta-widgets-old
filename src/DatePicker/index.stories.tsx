import React from 'react'

import { date as knobsDate, select } from '@storybook/addon-knobs'
import { DecoratorFn } from '@storybook/react'
import { addMonths, subYears } from 'date-fns'
import { withSmartKnobs } from 'storybook-addon-smart-knobs'

import { createMetadata, createStory } from '@/_private/storybook'
import { isValidDate } from '@/_private/utils/type-guards'

import { DatePicker, DateRange, sizes } from '.'
import { getDateMidnightFromString, getInputValue } from './components/InputDate/helpers'

const DECORATORS: readonly DecoratorFn[] = [withSmartKnobs({ ignoreProps: ['type'] })]
const DECORATORS_WITHOUT_SCALING: readonly DecoratorFn[] = [
  withSmartKnobs({ ignoreProps: ['type'] }),
]

const setInputValue = (value?: string) => {
  if (!value) {
    return undefined
  }

  const date = getDateMidnightFromString(value)

  return isValidDate(date) ? date : undefined
}

const defaultProps = () =>
  ({
    minDate: new Date(knobsDate('minDate', subYears(new Date(), 1))),
    maxDate: new Date(knobsDate('maxDate', addMonths(new Date(), 1))),
    size: select('size', sizes, sizes[1]),
  } as const)

const DakePickerSingleStoryContent = () => {
  const [date, setDate] = React.useState<Date | undefined>()

  return <DatePicker type="date" value={date} onChange={setDate} {...defaultProps()} />
}

export const DakePickerSingleStory = createStory(() => <DakePickerSingleStoryContent />, {
  name: 'Выбор даты',
  decorators: DECORATORS,
})

const DatePickerThirdPartyInputStoryContent = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date(2019, 3, 1))

  return (
    <DatePicker
      type="date"
      value={date}
      onChange={setDate}
      {...defaultProps()}
      renderControls={({ size, value, onChange }) => {
        return (
          <input
            type="date"
            value={getInputValue(value)}
            onChange={event => {
              onChange(setInputValue(event.target.value))
            }}
            className={size}
          />
        )
      }}
    />
  )
}

export const DatePickerThirdPartyInputStory = createStory(
  () => <DatePickerThirdPartyInputStoryContent />,
  { name: 'Выбор даты с сторонним инпутом', decorators: DECORATORS_WITHOUT_SCALING }
)

const DatePickerRangeStoryContent = () => {
  const [range, setRange] = React.useState<DateRange | undefined>([undefined, undefined])

  return <DatePicker type="date-range" value={range} onChange={setRange} {...defaultProps()} />
}

export const DatePickerRangeStory = createStory(() => <DatePickerRangeStoryContent />, {
  name: 'Выбор диапазона дат',
  decorators: DECORATORS,
})

const DatePickerRangeThirdPartyInputStoryContent = () => {
  const [range, setRange] = React.useState<DateRange | undefined>([undefined, undefined])

  return (
    <DatePicker
      type="date-range"
      value={range}
      onChange={setRange}
      {...defaultProps()}
      renderControls={({ size, value, onChange }) => {
        return (
          <>
            <input
              type="date"
              value={value && getInputValue(value[0])}
              onChange={event => {
                onChange([setInputValue(event.target.value), (value && value[1]) || undefined])
              }}
              className={size}
            />
            <input
              type="date"
              value={value && getInputValue(value[1])}
              onChange={event => {
                onChange([(value && value[0]) || undefined, setInputValue(event.target.value)])
              }}
              className={size}
            />
          </>
        )
      }}
    />
  )
}

export const DatePickerRangeThirdPartyInputStory = createStory(
  () => <DatePickerRangeThirdPartyInputStoryContent />,
  {
    name: 'Выбор диапазона дат с сторонними инпутами',
    decorators: DECORATORS_WITHOUT_SCALING,
    parameters: { environment: { scaling: false } },
  }
)

const DatePickerExpandedStoryContent = () => {
  const [date, setDate] = React.useState<Date | undefined>()

  return (
    <DatePicker
      type="date"
      value={date}
      onChange={setDate}
      useInputDate={false}
      useActionButtons={false}
      {...defaultProps()}
    />
  )
}

export const DatePickerExpandedStory = createStory(() => <DatePickerExpandedStoryContent />, {
  name: 'Выбор даты на развернутом пикере',
  decorators: DECORATORS,
})

const DatePickerExpandedStoryRangeContent = () => {
  const [range, setRange] = React.useState<DateRange | undefined>([undefined, undefined])

  return (
    <DatePicker
      type="date-range"
      value={range}
      onChange={setRange}
      useInputDate={false}
      useActionButtons={false}
      {...defaultProps()}
    />
  )
}

export const DatePickerExpandedRangeStory = createStory(
  () => <DatePickerExpandedStoryRangeContent />,
  {
    name: 'Выбор диапазона дат на развернутом пикере',
    decorators: DECORATORS,
  }
)

export default createMetadata({
  title: 'components/DatePicker',
})
