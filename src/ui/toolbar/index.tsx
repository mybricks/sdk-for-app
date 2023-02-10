import React, { useEffect, useContext } from 'react'
import Save from './save'
import Workflows from './workflows'
import Button from './button'

import LastUpdate from './last-update-info';
import { GoBack } from '../../../_deprecated/ui/Icons'

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
  return (
    <div className={styles.toolbar}>
      <div className={styles.left}>
        <div className={styles.leftContent}>
          {backIcon ? (
            <div className={styles.back} onClick={() => window.history.back()}>
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

Toolbar.Button = Button

Toolbar.Workflows = Workflows

export default Toolbar