import React, {
  forwardRef,
  useState,
  useImperativeHandle,
  useRef
} from 'react'
import {
  Divider,
  Badge,
  Button,
  Popover
} from 'antd'
import Locker from '../../locker'
import GlobalContext from '../../globalContext'
import SaveTimeDisplay from './SaveTimeDisplay'
import { code } from './icon'
import styles from './index.less'
import { MoreOutlined } from '@ant-design/icons'

interface ToolbarProps {
  appData: {
    fileContent: {
      _updateTime: number
      [key: string]: any
    }
    user: any
    fileId: number
  }
  moreActions: {
    icon: JSX.Element
    title: string
    onClick: () => void
  }[]
  // downloadVibeUI: () => void
  onOperableChange: (operable: boolean) => void
  beforeToggleUnLock: () => Promise<boolean>
  onSave: () => Promise<void>
}

export interface TitlebarRef {
  setSavedTime: (savedTime: number) => void
  setHasUnsaved: (hasUnsaved: boolean) => void
  setCanSave: (canSave: boolean) => void
  setIsSaving: (isSaving: boolean) => void
}
const DesignerToolBar = forwardRef<TitlebarRef, ToolbarProps>((props, ref) =>{ 
  const {
    appData,
    moreActions,
    onSave,
    // downloadVibeUI,
    onOperableChange,
    beforeToggleUnLock
  } = props

  const [savedTime, setSavedTime] = useState(appData.fileContent._updateTime)
  const [hasUnsaved, setHasUnsaved] = useState(false)
  const [canSave, setCanSave] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const appDataRef = useRef({
    fileContent: appData.fileContent,
    user: appData.user,
    fileId: appData.fileId
  })

  useImperativeHandle(ref, () => {
    return {
      setSavedTime,
      setHasUnsaved,
      setCanSave,
      setIsSaving,
    }
  })

  return (
    <div className={styles['toolbar']}>
      <div className={styles['toolbar-right']}>
        <div className={styles['toolbar-main']}>
          <GlobalContext.Provider value={{ fileContent: appDataRef.current.fileContent, user: appDataRef.current.user, fileId: appDataRef.current.fileId }}>
            <Locker
              statusChange={(props) => {
                if (typeof props === 'number') {
                  onOperableChange(props === 1)
                } else {
                  const { status } = props
                  onOperableChange(status === 1)
                }
              }}
              beforeToggleUnLock={beforeToggleUnLock}
              compareVersion={true}
              autoLock={true}
            />
          </GlobalContext.Provider>
          <div className={styles['save-actions']}>
            <Badge dot={hasUnsaved}>
              <Button
                type='primary'
                disabled={!canSave}
                loading={isSaving}
                onClick={() => {
                  appDataRef.current.fileContent.saveLoading = true
                  onSave()
                    .then((res: any) => {
                      if (res?.version) {
                        appDataRef.current.fileContent.version = res.version
                      }
                    })
                    .catch(() => {

                    })
                    .finally(() => {
                      setTimeout(() => {
                        appDataRef.current.fileContent.saveLoading = false
                      }, 1 * 10 * 1000)
                    })
                }}
              >
                保存
              </Button>
            </Badge>
            {/* <div
              data-mybricks-tip={`{content:'在 IDE 中打开',position:'bottom'}`}
              className={styles['code_btn']}
              onClick={() => downloadVibeUI()}
            >
              {code}
            </div> */}
            {moreActions ? (
              <Popover
                content={() => {
                  return (
                    <div className={styles.popoverContent}>
                      {moreActions.map((action) => {
                        const { icon, title, onClick } = action
                        return (
                          <div className={styles.menuItem} onClick={onClick}>
                            {icon}
                            <span className={styles.menuItemText}>{title}</span>
                          </div>
                        )
                      })}
                    </div>
                  )
                }}
                placement="bottomRight"
                overlayClassName={styles.toolbarPopover}
              >
                <MoreOutlined
                  className={styles['vertical-dots']}
                  // onPointerEnterCapture={undefined}
                  // onPointerLeaveCapture={undefined}
                />
              </Popover>
            ) : null}
          </div>
        </div>
        <SaveTimeDisplay savedTime={savedTime}/>
      </div>
      <Divider className={styles.toolbarDivider} />
    </div>
  )
})

export { DesignerToolBar }
