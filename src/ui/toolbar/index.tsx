import React, { useCallback, useMemo } from 'react'

import Save from './save'
import Publish from './publish'
import Button from './button'
import Tips from './tips'
import { GoBack } from '../Icons'
import Workflows from './workflows'
import LastUpdate from './last-update-info'
import Tools from './tools'

import styles from './index.less'

// export const Toolbar = {
//   Button,
//   Save,
//   Workflows,
// }

const searchParams = new URL(location.href).searchParams;

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
      if (window.history.length <= 1) {
        window.location.href = '/workspace.html'
      } else {
        window.history.back()
      }
    } else {
      // 否则跳转到首页
      window.location.href = '/workspace.html'
    }
  }, [])

  const hasBackIcon = useMemo(() => {
    const noBackIcon = searchParams.get('noBackIcon') === '1';
    return noBackIcon ? false : backIcon
  }, [backIcon])

  return (
    <div className={styles.toolbar}>
      <div className={styles.left}>
        <div className={styles.leftContent}>
          {hasBackIcon ? (
            <div className={styles.back} onClick={handleBack}>
              {GoBack}
            </div>
          ) : (
            <div className={styles.back} />
          )}
          <div title={title} className={styles.projectName} style={{ marginRight: '10px' }}>
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

Toolbar.Tools = Tools

Toolbar.Tips = Tips

export default Toolbar
