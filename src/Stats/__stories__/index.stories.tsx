import React from 'react'

import { boolean, object } from '@storybook/addon-knobs'
import { withSmartKnobs } from 'storybook-addon-smart-knobs'

import { createMetadata, createStory } from '@/_private/storybook'

import { Data, Stats } from '..'

import docs from './docs.mdx'

const getBadgeKnob = (badge: Data['badge']) => {
  return boolean('отобразить бейдж', true) ? object('badge', badge) : undefined
}

export const Interactive = createStory(() => (
  <Stats
    title="Сроки"
    value={217}
    badge={getBadgeKnob({
      percentage: 2.1,
      status: 'normal',
    })}
    unit="суток"
    size="xs"
    layout="full"
  />
))

export const WithLineBreak = createStory(
  () => (
    <Stats
      title="Сроки срочные сроки срочные сроки срочные"
      value={217000}
      badge={getBadgeKnob({
        percentage: 2.1,
        status: 'normal',
      })}
      unit="суток / час / суток / час / суток / час"
      size="xs"
      layout="full"
    />
  ),
  { name: 'с переносом строки' }
)

export default createMetadata({
  title: 'components/Stats',
  decorators: [withSmartKnobs({ ignoreProps: ['badge'] })],
  parameters: {
    docs: {
      page: docs,
    },
    environment: {
      style: {
        width: 200,
      },
    },
  },
})
