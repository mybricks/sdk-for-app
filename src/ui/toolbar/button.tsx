import * as React from 'react'
import { Button } from 'antd'
import styles from './../View.less'

interface ButtonProps {
  disabled?: boolean
  onClick?: () => void
  children?: any
}

export default ({ disabled = false, onClick, children }: ButtonProps) => {
  return (
    <Button
      disabled={disabled}
      className={styles.toolbarButton}
      size="small"
      onClick={onClick}
    >
      <div />
      {children}
    </Button>
  )
}
