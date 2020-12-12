import React from 'react'

import { Example } from '@/_private/storybook'

import { LinearChart } from '../../'
import {
  boundaries,
  gridConfigFormat,
  gridConfigLabel,
  gridConfigPaddings,
  gridConfigSimple,
  linesBoundaries,
  linesFeatures,
  linesFormat,
  linesNull,
  linesSimple,
  linesThreshold,
  linesWithoutGradient,
  threshold,
} from '../data.mock'

export const LinearChartExampleWithoutGradient = () => (
  <Example width="300px" height="150px" margin="l">
    <LinearChart
      title="Название графика"
      lines={linesWithoutGradient}
      gridConfig={gridConfigSimple}
      isHorizontal
      unit="единицы"
      background="linear-gradient(to right, #f54d4d48, transparent)"
    />
  </Example>
)

export const LinearChartExampleLinesFeatures = () => (
  <Example width="300px" height="150px" margin="l">
    <LinearChart
      title="Название графика"
      lines={linesFeatures}
      gridConfig={gridConfigPaddings}
      isHorizontal
      unit="единицы"
      background="linear-gradient(to right, #f54d4d48, transparent)"
    />
  </Example>
)

export const LinearChartExampleGeneral = () => (
  <Example width="300px" height="150px" margin="l">
    <LinearChart
      title="Название графика"
      lines={linesSimple}
      gridConfig={gridConfigSimple}
      isHorizontal
      unit="единицы"
      background="linear-gradient(to right, #f54d4d48, transparent)"
    />
  </Example>
)

export const LinearChartExampleFormatLabelTooltip = () => (
  <Example width="300px" height="150px" margin="l">
    <LinearChart
      unit="км"
      lines={linesFormat}
      gridConfig={gridConfigFormat}
      isHorizontal
      formatValueForLabel={v => new Date(v).toLocaleDateString()}
      formatValueForTooltip={v => `${v} км`}
      formatValueForTooltipTitle={v => {
        const title = new Date(v)
          .toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })
          .replace('г.', '')
        return title[0].toUpperCase() + title.slice(1)
      }}
    />
  </Example>
)

export const LinearChartExampleFormatLabelData = () => (
  <Example width="300px" height="150px" margin="l">
    <LinearChart
      lines={linesFormat}
      gridConfig={gridConfigFormat}
      isHorizontal
      formatValueForLabel={v => new Date(v).toLocaleDateString()}
    />
  </Example>
)

export const LinearChartExampleFormatLabelProcent = () => (
  <Example width="300px" height="150px" margin="l">
    <LinearChart
      lines={linesSimple}
      gridConfig={gridConfigSimple}
      isHorizontal
      formatValueForLabel={v => `${v} %`}
    />
  </Example>
)

/**
 * Пример пока отключен так как проявляется проблема с расчетом
 * дробных px в компоненте Axis.
 */
/*
export const LinearChartExampleNotHorizontal = () => (
  <Example width="300px" height="150px" margin="l">
    <LinearChart
      title="Очень красивый график"
      lines={linesSimple}
      gridConfig={gridConfigSimple}
      unit="км"
      background="linear-gradient(to right, #f54d4d48, transparent)"
      isHorizontal={false}
    />
  </Example>
)
*/

export const LinearChartExampleLabel = () => (
  <Example width="300px" height="150px" margin="l">
    <LinearChart
      title="Очень красивый график"
      lines={linesSimple}
      gridConfig={gridConfigLabel}
      isHorizontal
      unit="км"
    />
  </Example>
)

export const LinearChartExampleDirectionXtoLeft = () => (
  <Example width="300px" height="150px" margin="l">
    <LinearChart
      directionX="toLeft"
      lines={linesSimple}
      gridConfig={gridConfigSimple}
      isHorizontal
    />
  </Example>
)

export const LinearChartExampleDirectionXtoRight = () => (
  <Example width="300px" height="150px" margin="l">
    <LinearChart
      directionX="toRight"
      lines={linesSimple}
      gridConfig={gridConfigSimple}
      isHorizontal
    />
  </Example>
)

export const LinearChartExampleDirectionYtoTop = () => (
  <Example width="300px" height="150px" margin="l">
    <LinearChart
      directionY="toTop"
      lines={linesSimple}
      gridConfig={gridConfigSimple}
      isHorizontal
    />
  </Example>
)

export const LinearChartExampleDirectionYtoBottom = () => (
  <Example width="300px" height="150px" margin="l">
    <LinearChart
      directionY="toBottom"
      lines={linesSimple}
      gridConfig={gridConfigSimple}
      isHorizontal
      unit="км"
    />
  </Example>
)

export const LinearChartExampleNull = () => (
  <Example width="300px" height="150px" margin="l">
    <LinearChart lines={linesNull} gridConfig={gridConfigSimple} isHorizontal />
  </Example>
)

export const LinearChartExampleBoundaries = () => (
  <Example width="600px" height="300px" margin="l">
    <LinearChart
      lines={linesBoundaries}
      gridConfig={gridConfigSimple}
      boundaries={boundaries}
      boundariesAxis="y"
      showBoundariesOnAxis
      isHorizontal
    />
  </Example>
)

export const LinearChartExampleZoom = () => (
  <Example width="300px" height="150px" margin="l">
    <LinearChart
      title="Очень красивый график"
      lines={linesSimple}
      gridConfig={gridConfigSimple}
      isHorizontal
      unit="км"
      withZoom
    />
  </Example>
)

export const LinearChartExampleThreshold = () => (
  <Example width="700px" height="300px" margin="l">
    <LinearChart
      title="График с предельными значениями"
      lines={linesThreshold}
      gridConfig={gridConfigSimple}
      threshold={threshold}
      isHorizontal
      unit="тыс. м3"
      formatValueForLabel={v => new Date(v).toLocaleDateString()}
      formatValueForTooltip={v => `${v} тыс м3`}
      formatValueForTooltipTitle={v => {
        const title = new Date(v)
          .toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })
          .replace('г.', '')
        return title[0].toUpperCase() + title.slice(1)
      }}
      withZoom
    />
  </Example>
)
