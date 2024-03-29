import React from 'react'

import Button from './button'

import css from './index.less'

interface SaveButtonProps {
  disabled?: boolean
  loading?: boolean
  /** 右上角小红点提示可以保存 */
  dotTip?: boolean
  onClick?: () => void
  children?: any
}

export default ({
  disabled = false,
  loading = false,
  dotTip = false,
  onClick,
  children,
}: SaveButtonProps) => {
  return (
    <Button
      disabled={disabled}
      loading={loading}
      onClick={onClick}
      type='primary'
    >
      <div className={css.saveDot} style={{visibility: (!disabled && dotTip) ? 'visible' : 'hidden' }}>＊</div>
      {children || '保存'}
    </Button>
  )
}
