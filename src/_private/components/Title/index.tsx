import React from 'react'

import classnames from 'classnames'

import css from './index.css'

type Props = {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

export const Title: React.FC<Props> = ({ children, className, style }) => {
  if (!children) {
    return null
  }

  return (
    <div className={classnames(css.main, className)} style={style}>
      {children}
    </div>
  )
}
