import React from 'react'

import classNames from 'classnames'

import { Title } from '@/_private/components/Title'

import css from './index.css'

type Props = {
  src: string
  title?: React.ReactNode
  className?: string
}

export const Image: React.FC<Props> = ({ src, title, className }) => {
  return (
    <div className={classNames(css.main, className)}>
      <Title>{title}</Title>
      <div style={{ backgroundImage: `url(${src})` }} className={css.image} />
    </div>
  )
}
