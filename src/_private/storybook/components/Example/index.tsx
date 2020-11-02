import React from 'react'

const margins = ['2xs', 'xs', 's', 'm', 'l'] as const
type Margin = typeof margins[number]

type Props = {
  margin?: Margin
  width?: string | number
  height?: string | number
}

const getMargin = (margin: Margin) => `var(--space-${margin})`

export const Example: React.FC<Props> = ({ margin = 'm', width, height, children }) => {
  const style: React.CSSProperties = {
    margin: `${getMargin(margin)} 0`,
    width,
    height,
  }

  return <div style={style}>{children}</div>
}
