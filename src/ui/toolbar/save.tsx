import * as React from 'react'
import { Button } from 'antd'
import styles from './../View.less'

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
      className={styles.toolbarButton}
      size="small"
      onClick={onClick}
    >
      {!disabled && dotTip ? (
        <div className={styles.saveDot}>＊</div>
      ) : (
        <div />
      )}
      {children || '保存'}
    </Button>
  )
}
