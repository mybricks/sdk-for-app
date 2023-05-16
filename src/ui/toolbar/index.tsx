import React, { useCallback } from 'react'

import Save from './save'
import Publish from './publish'
import Button from './button'
import { GoBack } from '../Icons'
import Workflows from './workflows'
import LastUpdate from './last-update-info'

import styles from './index.less'

// export const Toolbar = {
//   Button,
//   Save,
//   Workflows,
// }

interface ToolbarProps {
  /** 返回按钮 */
  backIcon?: boolean | any
  /** 标题 */
  title?: string
  /** 最新保存信息 */
  updateInfo?: any
  children?: any
}

const Toolbar = ({
  title,
  backIcon = true,
  updateInfo,
  children,
}: ToolbarProps) => {

  const handleBack = useCallback(() => {
    if (document.referrer.startsWith(location.origin)) {
      // 同域直接返回
      window.history.back()
    } else {
      // 否则跳转到首页
      window.location.href = '/workspace.html'
    }
  }, [])

  return (
    <div className={styles.toolbar}>
      <div className={styles.left}>
        <div className={styles.leftContent}>
          {backIcon ? (
            <div className={styles.back} onClick={handleBack}>
              {GoBack}
            </div>
          ) : (
            <div className={styles.back} />
          )}
          <div className={styles.projectName} style={{ marginRight: 'auto' }}>
            {title}
          </div>
        </div>
        {updateInfo}
      </div>
      <div className={styles.right}>
        {children}
      </div>
    </div>
  )
}

Toolbar.LastUpdate = LastUpdate

Toolbar.Save = Save

Toolbar.Publish = Publish

Toolbar.Button = Button

Toolbar.Workflows = Workflows

export default Toolbar
