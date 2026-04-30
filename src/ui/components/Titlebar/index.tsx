import React, { useState, forwardRef, useImperativeHandle } from 'react'
import { THEME_CONFIG } from '../../constants'
import { useTheme } from '../../hooks/useTheme'
import styles from './index.less'

interface ToolbarProps {
  appData: {
    fileContent: {
      name: string;
      _updateTime: number
      [key: string]: any
    }
    user: any
    fileId: number
  }
}

export interface TitlebarRef {
  setTitle: (nextTitle: string) => void
}

const DesignerTitleBar = forwardRef<TitlebarRef, ToolbarProps>(
  ({ appData }, ref) => {
    const { isDarkMode, currentAssets } = useTheme(THEME_CONFIG)
    const [title, setTitle] = useState(appData.fileContent.name)

    useImperativeHandle(ref, () => {
      return {
        setTitle
      }
    })

    const handleToHome = async () => {
      window.location.href = '/workspace.html'
    }

    return (
      <div
        className={`${styles['toolbar-left']}`}
      >
        <div
          className={styles['brand']}
          onClick={handleToHome}
        >
          <div className={styles['brand-icon-wrap']}>
            <div className={styles['user-info']}>
              <img
                src={currentAssets.logo}
                alt=""
                style={{ width: 26, height: 26 }}
              />
            </div>
          </div>
        </div>
        <div className={styles['edit-title-wrap']}>
          <span
            style={{ cursor: 'default' }}
            className={`${styles['page-slogan-title']} ${isDarkMode ? styles['page-slogan-title-dark'] : ''}`}
          >
            {title}
          </span>
        </div>
      </div>
    )
  },
)

export { DesignerTitleBar }
