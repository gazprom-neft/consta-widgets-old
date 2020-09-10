import React from 'react'

import { DEFAULT_BASE_SIZE } from '@consta/widgets-utils/lib/css'
import { isDefined } from '@consta/widgets-utils/lib/type-guards'
import { number, text } from '@storybook/addon-knobs'
import { DecoratorFn } from '@storybook/react'
import { EnvironmentDecoratorParams } from '@storybook/types'
import { withThemes } from 'storybook-addon-themes'

import { BaseSizeProvider } from '@/BaseSizeContext'

export const ENVIRONMENT_GROUP_ID = 'environment'

const CENTERING_STYLES: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  margin: '0 auto',
  width: '100%',
  maxWidth: '100%',
  minHeight: '100vh',
}

const getValue = (value?: number | string) => {
  if (!value) {
    return ''
  }

  if (typeof value === 'number') {
    return `${value}px`
  }

  return value
}

export const environmentDecorator = (): DecoratorFn => (storyFn, context) => {
  const { scaling = true, style } = (context.parameters.environment ||
    {}) as EnvironmentDecoratorParams

  const baseSize = scaling
    ? number('base-size', DEFAULT_BASE_SIZE, undefined, ENVIRONMENT_GROUP_ID)
    : undefined
  const Wrapper: React.FC = ({ children }) =>
    style ? (
      <div
        style={{
          ...style,
          width: style.width
            ? text('width', getValue(style.width), ENVIRONMENT_GROUP_ID)
            : undefined,
          height: style.height
            ? text('height', getValue(style.height), ENVIRONMENT_GROUP_ID)
            : undefined,
        }}
      >
        {children}
      </div>
    ) : (
      <>{children}</>
    )

  /**
   * Используем декоратор withThemes тут, потому что он должен быть между
   * BaseSizeProvider и контентом для корректной работы тем из ui-kit
   */
  const content = withThemes(
    () => (
      <div style={CENTERING_STYLES}>
        <Wrapper>{storyFn()}</Wrapper>
      </div>
    ),
    context
  )

  return isDefined(baseSize) ? (
    <BaseSizeProvider value={baseSize}>{content}</BaseSizeProvider>
  ) : (
    content
  )
}
