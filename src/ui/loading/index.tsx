import React, { useMemo, ReactNode } from 'react'

import css from './index.less'

interface LoadingProps {
  /** 提示 */
  tip?: string
  /** 是否加载状态 */
  loading: boolean
  children: ReactNode
}

export default function Loading({loading, tip = '加载中，请稍后...', children}: LoadingProps) {
  return useMemo(() => {
    return loading ? (
      <div className={css.loadingContainer}>
        <div className={css.loadingText}>
          {tip}
        </div>
      </div>
    ) : (
      <>
        {children}
      </>
    )
  }, [loading])
}

