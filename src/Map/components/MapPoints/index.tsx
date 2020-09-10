import React from 'react'

import { isDefined } from '@consta/widgets-utils/lib/type-guards'
import * as d3 from 'd3'
import { LineString } from 'geojson'

import {
  ConnectionPoint,
  Coords,
  GeoObject,
  GeoObjectLocation,
  GeoPoint,
  RenderConnectionLine,
  RenderConnectionPoint,
  RenderObjectPoint,
  RenderPoint,
  SelectedObjectId,
} from '../../'
import { geoCoordsToPixels, geoPointsToExtendedFeature } from '../../helpers'

import css from './index.css'

type CommonCircleParams = {
  coords: Coords
  x: number
  y: number
  connectedPoints: readonly ConnectionPoint[]
}

type ObjectCircle = CommonCircleParams & {
  object: GeoObject
  pointsInsideObject: readonly GeoPoint[]
}

type PointCircle = CommonCircleParams & {
  point: GeoPoint
}

type Props = {
  objects: readonly GeoObject[]
  locations: readonly GeoObjectLocation[]
  points: readonly GeoPoint[]
  connectionPoints: readonly ConnectionPoint[]
  selectedObjectId: SelectedObjectId
  isZooming: boolean
  projection: d3.GeoProjection
  geoPath: d3.GeoPath
  renderPoint: RenderPoint
  renderObjectPoint: RenderObjectPoint
  renderConnectionPoint: RenderConnectionPoint
  renderConnectionLine: RenderConnectionLine
  onObjectSelect: (object: GeoObject) => void
  onObjectHover: (object?: GeoObject) => void
}

const isPointCircle = (circle: PointCircle | ObjectCircle): circle is PointCircle =>
  'point' in circle

const getPointsInsideObject = (
  object: GeoObject,
  points: readonly GeoPoint[],
  locations: readonly GeoObjectLocation[]
): readonly GeoPoint[] => {
  switch (object.type) {
    case 'country':
    case 'region':
      return [
        // Точки внутри региона
        ...points.filter(p => p.parentId === object.id),
        // Точки внутри локаций региона
        ...locations
          .filter(l => l.parentId === object.id)
          .map(l => points.filter(p => p.parentId === l.id))
          .flat(),
      ]
    case 'location':
      return points.filter(p => p.parentId === object.id)
  }
}

const ForeignObjectWrapper: React.FC<{ x: number; y: number }> = ({ x, y, children }) => {
  return (
    <foreignObject x={x} y={y}>
      <div className={css.foreignObjectWrapper}>{children}</div>
    </foreignObject>
  )
}

const getLineStringFeatureFromCoordinates = (
  from: Coords,
  to: Coords
): d3.ExtendedFeature<LineString> => {
  return {
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: [[...to], [...from]],
    },
    properties: {},
  }
}

export const MapPoints: React.FC<Props> = ({
  objects,
  points,
  locations,
  connectionPoints,
  selectedObjectId,
  isZooming,
  projection,
  geoPath,
  renderPoint,
  renderObjectPoint,
  renderConnectionPoint,
  renderConnectionLine,
  onObjectSelect,
  onObjectHover,
}) => {
  const objectCircles: readonly ObjectCircle[] = objects
    .map(object => {
      const pointsInsideObject = getPointsInsideObject(object, points, locations)
      const coords = d3.geoCentroid(geoPointsToExtendedFeature(pointsInsideObject))
      const pixelCoords = geoCoordsToPixels(projection, coords)

      if (!pixelCoords) {
        return undefined
      }

      const { x, y } = pixelCoords

      const connectedPoints = connectionPoints.filter(connectionPoint =>
        pointsInsideObject.some(point => point.connectionPointId === connectionPoint.id)
      )

      return {
        object,
        pointsInsideObject,
        coords,
        x,
        y,
        connectedPoints,
      }
    })
    .filter(isDefined)

  const pointCircles: readonly PointCircle[] = points
    .filter(point => point.parentId === selectedObjectId)
    .map(point => {
      const pixelCoords = geoCoordsToPixels(projection, point.coords)

      if (!pixelCoords) {
        return undefined
      }

      const { x, y } = pixelCoords

      return {
        point,
        coords: point.coords,
        x,
        y,
        connectedPoints: connectionPoints.filter(
          connectionPoint => connectionPoint.id === point.connectionPointId
        ),
      }
    })
    .filter(isDefined)

  const allCircles = [...objectCircles, ...pointCircles] as const

  return (
    <g className={css.main}>
      {/* Соединительные линии (идут до кругов, чтобы быть под ними) */}
      <g>
        {allCircles.map((circle, circleIdx) => {
          return (
            <React.Fragment key={circleIdx}>
              {circle.connectedPoints.map((connectedPoint, lineIdx) => {
                const fromObjectId = 'object' in circle ? circle.object.id : circle.point.id
                const feature = getLineStringFeatureFromCoordinates(
                  circle.coords,
                  connectedPoint.coords
                )

                return (
                  <React.Fragment key={lineIdx}>
                    {renderConnectionLine({
                      fromObjectId,
                      toObjectId: connectedPoint.id,
                      d: geoPath(feature),
                      lineLength: geoPath.measure(feature),
                      preventAnimation: isZooming,
                    })}
                  </React.Fragment>
                )
              })}
            </React.Fragment>
          )
        })}
      </g>

      {/* Точки, к которым ведут линии (например, ЦУБ-ы) */}
      <g>
        {connectionPoints.map(connectionPoint => {
          const coords = geoCoordsToPixels(projection, connectionPoint.coords)

          return coords ? (
            <ForeignObjectWrapper key={connectionPoint.id} x={coords.x} y={coords.y}>
              {renderConnectionPoint(connectionPoint)}
            </ForeignObjectWrapper>
          ) : null
        })}
      </g>

      {/* Точки на карте: стран, регионов и кастомные (например, скважины или ДО) */}
      <g>
        {allCircles.map((circle, idx) => {
          const { x, y } = circle

          return (
            <ForeignObjectWrapper key={idx} x={x} y={y}>
              {isPointCircle(circle)
                ? renderPoint(circle.point)
                : renderObjectPoint(
                    circle.object,
                    { pointsInsideObject: circle.pointsInsideObject },
                    {
                      onClick: () => onObjectSelect(circle.object),
                      onMouseEnter: () => onObjectHover(circle.object),
                      onMouseLeave: () => onObjectHover(undefined),
                    }
                  )}
            </ForeignObjectWrapper>
          )
        })}
      </g>
    </g>
  )
}
