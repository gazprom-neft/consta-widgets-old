import React from 'react'

import {
  BASE_SIZE_PROPERTY_NAME,
  DEFAULT_BASE_SIZE,
  getCalculatedSize,
} from '@consta/widgets-utils/lib/css'

import css from './index.css'

const BaseSizeContext = React.createContext(DEFAULT_BASE_SIZE)

export const BaseSizeProvider: React.FC<{ value: number }> = ({ value, children }) => {
  return (
    <BaseSizeContext.Provider value={value}>
      <div
        className={css.main}
        style={{
          [BASE_SIZE_PROPERTY_NAME as string]: value,
        }}
      >
        {children}
      </div>
    </BaseSizeContext.Provider>
  )
}

export const useBaseSize = () => {
  const baseSize = React.useContext(BaseSizeContext)
  const getCalculatedSizeWithBaseSize = (size: number) => getCalculatedSize(size, baseSize)

  return {
    baseSize,
    getCalculatedSizeWithBaseSize,
  }
}
