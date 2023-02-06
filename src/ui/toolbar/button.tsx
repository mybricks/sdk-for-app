import * as React from 'react'
import { Button } from 'antd'
import css from './index.less'

interface ButtonProps {
  disabled?: boolean
  loading?: boolean
  onClick?: () => void
  children?: any
}

export default ({ disabled = false, loading = false, onClick, children }: ButtonProps) => {
  return (
    <Button
      disabled={disabled}
      loading={loading}
      className={css.button}
      size="small"
      onClick={onClick}
    >
      <div />
      {children}
    </Button>
  )
}
