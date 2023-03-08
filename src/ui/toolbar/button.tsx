import React from 'react'

import { LoadingOutlined } from '@ant-design/icons'

import css from './index.less'

interface SaveButtonProps {
  disabled?: boolean
  loading?: boolean
  /** 右上角小红点提示可以保存 */
  dotTip?: boolean
  onClick?: () => void
  children?: any
  type?: 'primary'
}

export default ({
  disabled = false,
  loading = false,
  onClick,
  children,
  type,
}: SaveButtonProps) => {
  return (
    <button
      disabled={disabled}
      className={`${css.button} ${type === 'primary' ? css.mainButton : ''} ${loading ? css.loading : ''}`}
      onClick={() => {
        if (!loading) {
          onClick?.()
        }
      }}
    >
      <LoadingOutlined style={{marginRight: 4, display: loading ? 'inline-block' : 'none'}}/>
      {children}
    </button>
  )
}
