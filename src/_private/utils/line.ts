import { updateAt } from '@consta/widgets-utils/lib/array'

type Points<T> = readonly T[]

type Segment<T> = {
  type: 'solid' | 'dashed'
  points: readonly T[]
}

export function getSolidSegments<T, U extends T>(
  points: Points<T>,
  pointIsNotEmptyChecker: (point: T) => point is U
): ReadonlyArray<Segment<U>> {
  let currentSegmentIdx = 0
  // Делим линию на сегменты, где значения идут без пропусков (они будут сплошными на графике)
  return points.reduce((acc: ReadonlyArray<Segment<U>>, point) => {
    const currentSegment = acc[currentSegmentIdx]

    if (pointIsNotEmptyChecker(point)) {
      return currentSegment
        ? // Добавляем в текущий сегмент
          updateAt(acc, currentSegmentIdx, {
            ...currentSegment,
            points: [...currentSegment.points, point],
          })
        : // Добавляем новый сегмент вместе с первой точкой
          acc.concat({
            type: 'solid',
            points: [point],
          } as const)
    }

    if (currentSegment) {
      currentSegmentIdx++
    }

    return acc
  }, [])
}
