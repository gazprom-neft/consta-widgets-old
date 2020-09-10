import { isNotNil } from '@consta/widgets-utils/lib/type-guards'
import * as d3 from 'd3'
import * as _ from 'lodash'

import {
  Axis,
  Boundary,
  Item,
  itemIsNotEmpty,
  Line,
  NotEmptyItem,
  NumberRange,
  TickValues,
} from './'
import { ZoomState } from './components/Zoom'

export const INITIAL_DOMAIN = [Number.MIN_VALUE, Number.MAX_VALUE] as const

export const getIndexWithFallbackToDefault = (index: number, def: number): number =>
  index < 0 ? def : index

export const padDomain = ({
  domain,
  paddingStart,
  paddingEnd,
  zoomScale,
}: {
  domain: NumberRange
  paddingStart: number
  paddingEnd: number
  zoomScale: number
}): NumberRange => {
  const [start, end] = domain
  const diff = domain[1] - domain[0]
  const delta = diff === 0 ? domain[0] : diff

  return [
    start - paddingStart * delta * (1 / zoomScale),
    end + paddingEnd * delta * (1 / zoomScale),
  ]
}

export const invertDomain = ([start, end]: NumberRange): NumberRange => [end, start]

export const zoomDomain = (domain: NumberRange, zoom: ZoomState): NumberRange => {
  const [domainStart, domainEnd] = domain
  const domainDelta = domainEnd - domainStart
  return [domainStart + domainDelta * zoom[0], domainStart + domainDelta * zoom[1]]
}

export const getXRange = (width: number) => [0, width] as NumberRange
export const getYRange = (height: number) =>
  [
    // Чтобы нарисовался гридлайн на нижней оси
    height - 1,
    0,
  ] as NumberRange

export const getXScale = (domain: NumberRange, width: number) =>
  d3
    .scaleLinear()
    .domain([...domain])
    .range(getXRange(width))

export const getYScale = (domain: NumberRange, height: number) =>
  d3
    .scaleLinear()
    .domain([...domain])
    .range(getYRange(height))

export const calculateSecondaryDomain = ({
  mainDomainMin,
  mainDomainMax,
  linesValues,
  getValue,
  getDomain,
  isInverted,
}: {
  mainDomainMin: number
  mainDomainMax: number
  linesValues: ReadonlyArray<readonly Item[]>
  getValue: (v: NotEmptyItem) => number
  getDomain: (items: readonly NotEmptyItem[]) => NumberRange
  isInverted: boolean
}): NumberRange => {
  const lineDomains = linesValues.map(values => {
    const zoomRangeIndexes = _.sortBy([
      getIndexWithFallbackToDefault(
        _.findLastIndex(values, v => itemIsNotEmpty(v) && getValue(v) <= mainDomainMin),
        0
      ),
      getIndexWithFallbackToDefault(
        _.findIndex(values, v => itemIsNotEmpty(v) && getValue(v) >= mainDomainMax),
        values.length - 1
      ),
    ])

    const valuesInZoomRange = values
      .slice(zoomRangeIndexes[0], zoomRangeIndexes[1] + 1)
      .filter(itemIsNotEmpty)

    return valuesInZoomRange.length ? getDomain(valuesInZoomRange) : [0, 0]
  })

  const domain = d3.extent(lineDomains.flat(), v => v) as NumberRange
  return isInverted ? invertDomain(domain) : domain
}

export const isInDomain = (value: number, domain: readonly number[]) => {
  const minInDomain = Math.min(...domain)
  const maxInDomain = Math.max(...domain)

  return value >= minInDomain && value <= maxInDomain
}

export const getUniqValues = (
  items: readonly Item[],
  domain: NumberRange,
  type: 'x' | 'y'
): readonly number[] => {
  return _.sortBy(
    _.uniq(items.map(v => v[type]))
      .filter(isNotNil)
      .filter(i => isInDomain(i, domain))
  )
}

export const getMainTickValues = ({
  items,
  domain,
  ticksCount = 0,
  isHorizontal,
}: {
  items: readonly Item[]
  ticksCount: number | undefined
  domain: NumberRange
  isHorizontal: boolean
}): TickValues => {
  if (domain === INITIAL_DOMAIN) {
    return []
  }

  const uniqValues = getUniqValues(items, domain, isHorizontal ? 'x' : 'y')

  if (ticksCount === 2) {
    return _.uniq([uniqValues[0], uniqValues[uniqValues.length - 1]])
  }

  return ticksCount === 0
    ? []
    : _.chunk(uniqValues, Math.ceil(uniqValues.length / ticksCount)).map(arr => arr[0])
}

export const getSecondaryTickValues = ({
  items,
  domain,
  ticksCount = 0,
  isHorizontal,
}: {
  items: readonly Item[]
  domain: NumberRange
  ticksCount: number | undefined
  isHorizontal: boolean
}) => {
  if (domain === INITIAL_DOMAIN) {
    return []
  }

  const uniqValues = getUniqValues(items, domain, isHorizontal ? 'y' : 'x')

  if (ticksCount === 2) {
    return _.uniq([uniqValues[0], uniqValues[uniqValues.length - 1]])
  }

  return ticksCount === 0 ? [] : d3.ticks(domain[0], domain[1], ticksCount)
}

export function flipPointsOnAxes<T extends Item | NotEmptyItem>(
  items: readonly T[],
  isHorizontal?: boolean
): readonly T[] {
  return isHorizontal
    ? items
    : items.map(
        item =>
          ({
            x: item.y,
            y: item.x,
          } as T)
      )
}
export const isBoundariesHorizontal = (axis: Axis, isHorizontal: boolean) =>
  (axis === 'x' && isHorizontal) || (axis === 'y' && !isHorizontal)

export const getBoundary = ({
  boundaries,
  item,
  axis,
  isHorizontal,
}: {
  boundaries: readonly Boundary[]
  item: Item
  axis: Axis
  isHorizontal: boolean
}) => {
  const position = isBoundariesHorizontal(axis, isHorizontal) ? item.x : item.y

  if (position === null) {
    return undefined
  }

  return boundaries.find(boundary => {
    const value = _.sortBy(boundary.value)
    return position >= value[0] && position < value[1]
  })
}

export const getColorFromFirstLineWithBoundaries = (lines: readonly Line[]) => {
  const line = lines.find(l => l.withBoundaries)
  if (!line) {
    return 'transparent'
  }

  return line.color
}
