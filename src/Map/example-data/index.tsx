import React from 'react'

import { isDefined } from '@consta/widgets-utils/lib/type-guards'
import { Button } from '@gpn-design/uikit/Button'
import classnames from 'classnames'
import { ExtendedFeature, ExtendedFeatureCollection } from 'd3'
import * as d3 from 'd3'
import { Point, Polygon } from 'geojson'
import { uniq } from 'lodash'

import {
  ConnectionPoint,
  GeoObjectLocation,
  GeoPoint,
  getGeoObjectName,
  RenderConnectionLine,
  RenderConnectionPoint,
  RenderObjectPoint,
  RenderPoint,
  RenderZoomOutButton,
} from '../'

import css from './index.css'

const locationsData: ReadonlyArray<readonly [string, ExtendedFeatureCollection]> = [
  ['RU-YAN', require('./ЯНАО.geojson')],
  ['RU-KHM', require('./ХМАО.geojson')],
  ['RU-TOM', require('./Томск.geojson')],
  ['RU-IRK', require('./Иркутск.geojson')],
  ['RS', require('./Сербия.geojson')],
] as const

const transformFeature = (
  id: string,
  feature: ExtendedFeature<Polygon>
): ExtendedFeature<Polygon> => {
  return {
    ...feature,
    geometry: {
      ...feature.geometry,
      coordinates: feature.geometry.coordinates.map(c => [...c].reverse()),
    },
    properties: {
      name: (feature.properties && feature.properties.description) || id,
    },
  }
}

const isPolygon = (feature: ExtendedFeature): feature is ExtendedFeature<Polygon> => {
  return Boolean(feature.geometry && feature.geometry.type === 'Polygon')
}

const isPoint = (feature: ExtendedFeature): feature is ExtendedFeature<Point> => {
  return Boolean(feature.geometry && feature.geometry.type === 'Point')
}

const yaMapsToGeoObject = (
  parentId: string,
  yaMapsObject: ExtendedFeatureCollection
): readonly GeoObjectLocation[] => {
  return yaMapsObject.features.filter(isPolygon).map((feature, idx) => {
    const id = `${parentId}-${idx}`

    return {
      type: 'location',
      id,
      parentId,
      geoData: transformFeature(id, feature),
      name: feature.properties ? feature.properties.description : id,
    }
  })
}

export const EXAMPLE_LOCATIONS: readonly GeoObjectLocation[] = locationsData
  .map(([id, data]) => yaMapsToGeoObject(id, data))
  .flat()

export const EXAMPLE_CONNECTION_POINTS: readonly ConnectionPoint[] = [
  {
    id: 'Спб',
    coords: [30.311515, 59.942568],
    name: 'ЦУБ Санкт-Петербург',
  },
  {
    id: 'Тюмень',
    coords: [65.534328, 57.153033],
    name: 'ЦУБ Тюмень',
  },
]

const getConnectionPointId = (point: ExtendedFeature<Point>): string | undefined => {
  if (!point.properties) {
    return
  }

  const found = point.properties.description.match(/^ЦУБ=(?<id>.*)$/)
  return found ? found.groups.id : undefined
}

const yaMapsToGeoPoint = (
  yaMapsObject: ExtendedFeatureCollection,
  locations: readonly GeoObjectLocation[]
): readonly GeoPoint[] => {
  return yaMapsObject.features
    .filter(isPoint)
    .map((point, idx): GeoPoint | undefined => {
      const { coordinates } = point.geometry
      const parentLocation = locations.find(location =>
        d3.geoContains(location.geoData, [coordinates[0], coordinates[1]])
      )

      return parentLocation
        ? {
            id: `${parentLocation.id}-${idx}`,
            name: point.properties ? point.properties.iconCaption : undefined,
            parentId: parentLocation.id,
            connectionPointId: getConnectionPointId(point),
            coords: [coordinates[0], coordinates[1]] as const,
          }
        : undefined
    })
    .filter(isDefined)
}

export const EXAMPLE_POINTS: readonly GeoPoint[] = locationsData
  .map(([id, data]) =>
    yaMapsToGeoPoint(
      data,
      EXAMPLE_LOCATIONS.filter(location => location.parentId === id)
    )
  )
  .flat()

export const renderExampleConnectionPoint: RenderConnectionPoint = connectionPoint => {
  return (
    <button
      type="button"
      className={css.connectionPoint}
      onClick={() => alert(`Клик на ЦУБ:\n${JSON.stringify(connectionPoint)}`)}
    >
      <span className={css.connectionPointText}>{connectionPoint.name}</span>
    </button>
  )
}

export const renderExamplePoint: RenderPoint = point => {
  return (
    <button
      type="button"
      className={css.point}
      onClick={() => alert(`Клик по скважине:\n${JSON.stringify(point)}`)}
    >
      <span className={css.pointText}>{point.name}</span>
    </button>
  )
}

export const renderExampleObjectPoint: RenderObjectPoint = (object, info, mouseHandlers) => {
  const location = EXAMPLE_LOCATIONS.find(l => l.id === object.id)
  const name = location ? location.name : getGeoObjectName(object.id)

  return (
    <button type="button" className={css.point} {...mouseHandlers}>
      {info.pointsInsideObject.length}
      <span className={css.pointText}>{name}</span>
    </button>
  )
}

const countrysIds = uniq(EXAMPLE_LOCATIONS.map(location => location.parentId))
const locationsIds = uniq(EXAMPLE_LOCATIONS.map(location => location.id))
const pointsIds = uniq(EXAMPLE_POINTS.map(point => point.id))

const calculateDelay = (index: number) => (index + 1) * 1000

const getConnectionLineDelay = (fromObjectId: string) => {
  const countryIndex = countrysIds.findIndex(id => id === fromObjectId)
  if (countryIndex !== -1) {
    return calculateDelay(countryIndex)
  }

  const locationIndex = locationsIds.findIndex(id => id === fromObjectId)
  if (locationIndex !== -1) {
    return calculateDelay(locationIndex)
  }

  const pointIndex = pointsIds.findIndex(id => id === fromObjectId)
  if (pointIndex !== -1) {
    return calculateDelay(pointIndex)
  }

  return calculateDelay(0)
}

export const renderExampleConnectionLine: RenderConnectionLine = ({
  fromObjectId,
  d,
  lineLength,
  preventAnimation,
}) => {
  const isDashed = fromObjectId.includes('RU-TOM')
  const delay = getConnectionLineDelay(fromObjectId)

  return d ? (
    <g>
      <path d={d} className={classnames(css.connectionLine, isDashed && css.isDashed)} />
      {!preventAnimation && !isDashed && (
        <path
          d={d}
          className={classnames(css.connectionLine, css.isAnimated)}
          style={{
            ['--line-length' as string]: lineLength,
            animationDelay: `${delay}ms`,
          }}
        />
      )}
    </g>
  ) : null
}

export const renderExampleZoomOutButton: RenderZoomOutButton = ({ onClick }) => (
  <Button
    label="Уменьшить масштаб"
    size="s"
    view="ghost"
    onClick={onClick}
    className={css.zoomOut}
  />
)
