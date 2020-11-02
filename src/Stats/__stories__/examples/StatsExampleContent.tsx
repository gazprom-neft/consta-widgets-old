import React from 'react'

import { Example } from '@/_private/storybook'

import { Stats } from '../..'

export const StatsExampleContent = () => (
  <Example width="200px">
    <Stats
      title="Заголовок"
      value={146}
      badge={{
        percentage: 100,
        status: 'normal',
      }}
      unit="единиц"
      layout="full"
      size="s"
    />
  </Example>
)

export const StatsExampleContentWithSign = () => (
  <Example width="200px">
    <Stats
      title="Выработка"
      value={250}
      badge={{
        percentage: 20,
        status: 'success',
      }}
      unit="тысяч тонн в час"
      layout="full"
      size="s"
      withSign
    />
  </Example>
)

export const StatsExampleContentLong = () => (
  <Example width="200px">
    <Stats
      title="В этом году весна особенно прекрасна"
      value={17}
      badge={{
        percentage: 41,
        status: 'error',
      }}
      unit="счастливых мгновений для каждого"
      layout="full"
      size="s"
      withSign
    />
  </Example>
)
