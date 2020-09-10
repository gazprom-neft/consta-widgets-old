import React, { RefObject } from 'react'

import { getDayPlural } from '@consta/widgets-utils/lib/pluralization'
import { Position, usePopoverReposition } from '@gpn-design/uikit/Popover'
import { Text } from '@gpn-design/uikit/Text'
import { Tooltip } from '@gpn-design/uikit/Tooltip'
import classnames from 'classnames'

import { daysDiff, formatDate, getEndOfDay, getStartOfDay } from '@/_private/utils/time'

import { Item } from '../..'

import css from './index.css'

type Props = {
  anchorRef: RefObject<HTMLElement>
  color: string
  position: Position
  plan?: Item
  fact?: Item
  forecast?: Item
  title?: string
  comment?: string
  onRequestClose: () => void
}

const MAX_LENGTH_COMMENT = 280

const getDayText = (start: number, end: number) =>
  getDayPlural(daysDiff(getStartOfDay(start), getEndOfDay(end)))

const DateText: React.FC<{ label: string; startDate: number; endDate: number }> = ({
  label,
  startDate,
  endDate,
}) => (
  <>
    <Text as="span" size="xs" view="primary">
      <span className={css.label}>{label}: </span>
      {formatDate(startDate)} – {formatDate(endDate)}{' '}
    </Text>
    <Text as="span" size="xs" view="primary" weight="bold">
      ({getDayText(startDate, endDate)})
    </Text>
  </>
)

const Dates: React.FC<{
  color: string
  title?: string
  plan?: Item
  fact?: Item
  forecast?: Item
}> = ({ color, title, plan, fact, forecast }) => (
  <>
    {title && (
      <div className={css.dateBlock}>
        <Text as="div" size="xs" transform="uppercase" weight="bold" spacing="xs" view="primary">
          {title}
        </Text>
      </div>
    )}
    {plan && (
      <div className={css.dateBlock}>
        <span className={classnames(css.circle, css.isPlan)} style={{ background: color }} />
        <DateText label="План" startDate={plan.startDate} endDate={plan.endDate} />
      </div>
    )}
    {fact && (
      <div className={css.dateBlock}>
        <span className={css.circle} style={{ background: color }} />
        <DateText label="Факт" startDate={fact.startDate} endDate={fact.endDate} />
      </div>
    )}
    {forecast && (
      <div className={css.dateBlock}>
        <span className={classnames(css.circle, css.isForecast)} style={{ borderColor: color }} />
        <DateText label="Прогноз" startDate={forecast.startDate} endDate={forecast.endDate} />
      </div>
    )}
  </>
)

const Comment: React.FC<{ comment?: string }> = ({ comment }) => {
  if (!comment) {
    return null
  }

  const text = comment.substr(0, MAX_LENGTH_COMMENT)

  return (
    <div className={css.comment}>
      <Text as="div" size="xs" transform="uppercase" weight="bold" spacing="xs" view="primary">
        Комментарий:
      </Text>
      <Text as="span" size="xs" view="primary">
        {text}
        {comment.length > MAX_LENGTH_COMMENT ? '...' : ''}
      </Text>
    </div>
  )
}

export const RoadmapTooltip: React.FC<Props> = ({
  anchorRef,
  color,
  position,
  fact,
  forecast,
  plan,
  title,
  comment,
  onRequestClose,
}) => {
  const ref = React.useRef(null)

  usePopoverReposition({
    isActive: true,
    scrollAnchorRef: anchorRef,
    onRequestReposition: onRequestClose,
  })

  return (
    <Tooltip
      ref={ref}
      direction="upRight"
      size="l"
      possibleDirections={['downLeft', 'downRight', 'upLeft', 'upRight']}
      position={position}
      onClickOutside={onRequestClose}
    >
      <Dates color={color} title={title} fact={fact} plan={plan} forecast={forecast} />
      <Comment comment={comment} />
    </Tooltip>
  )
}
