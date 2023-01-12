import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'
import getAll from './getAll'
import getVersions from './getVersions'
import { Modal } from 'antd'
import styles from './openPanel.less'

const RightOutlined = window?.icons?.RightOutlined

interface ModalProps {
  /** 对话框是否可见 */
  open?: boolean
  /** 确定按钮 loading */
  confirmLoading?: boolean
  /** 标题 */
  title?: React.ReactNode
  /** 是否显示右上角的关闭按钮 */
  closable?: boolean
  /** 点击确定回调 */
  onOk?: (e: React.MouseEvent<HTMLElement>) => void
  /** 点击模态框右上角叉、取消按钮、Props.maskClosable 值为 true 时的遮罩层或键盘按下 Esc 时的回调 */
  onCancel?: (e: React.MouseEvent<HTMLElement>) => void
  afterClose?: () => void
  /** 垂直居中 */
  centered?: boolean
  /** 宽度 */
  width?: string | number
  /** 底部内容 */
  footer?: React.ReactNode
  /** 确认按钮文字 */
  okText?: React.ReactNode
  /** 取消按钮文字 */
  cancelText?: React.ReactNode
  /** 点击蒙层是否允许关闭 */
  maskClosable?: boolean
  /** 强制渲染 Modal */
  forceRender?: boolean
  destroyOnClose?: boolean
  style?: React.CSSProperties
  wrapClassName?: string
  maskTransitionName?: string
  transitionName?: string
  className?: string
  getContainer?: string | HTMLElement | false
  zIndex?: number
  bodyStyle?: React.CSSProperties
  maskStyle?: React.CSSProperties
  mask?: boolean
  keyboard?: boolean
  wrapProps?: any
  prefixCls?: string
  closeIcon?: React.ReactNode
  modalRender?: (node: React.ReactNode) => React.ReactNode
  focusTriggerAfterClose?: boolean
  children?: React.ReactNode
  /** @deprecated Please use `open` instead. */
  visible?: boolean
}

interface FModalProps extends ModalProps {
  // footer?: any
  // okText?: string
  // cancelText?: string
  // onOk?: () => any
  // onCancel?: () => any
  // className?: string
  // confirmLoading?: boolean
  // children?: JSX.Element
  content?: JSX.Element
}

const FModal = (props: ModalProps) => {
  return (
    <Modal destroyOnClose {...props} visible={true} open={true}>
      {props.children}
    </Modal>
  )
}

function Wrapper(Component: React.FC<ModalProps>) {
  const container = document.createElement('div')

  const hide = function () {
    ReactDOM.unmountComponentAtNode(container)
    document.body.removeChild(container)
  }
  const show = function (props: FModalProps) {
    document.body.appendChild(container)
    ReactDOM.render(
      <Component {...props} onCancel={hide}>
        {props?.content}
      </Component>,
      container
    )
  }

  return {
    show,
    hide,
  }
}

const SingleModal = Wrapper(FModal)

interface FileUrl {}

interface openPanelProps {
  canChooseFiles?: boolean
  canChooseDirectories?: boolean
  allowsMultipleSelection?: boolean
  allowedFileExtNames?: string[]
  onOk?: (urls: FileUrl[]) => void
  onCancel?: () => void
}

enum PathType {
  Files = '_files_',
  FileDetail = '_fileDetail_',
  VersionDetail = '_versionDetail_',
  Versions = '_versions_',
}

interface Path {
  fileId: number | string
  loading: false
  type?: PathType
}

interface FilePanelProps extends openPanelProps {
  onChange: any
}

const FilePanel = ({
  onChange,
  canChooseDirectories,
  allowedFileExtNames,
}: FilePanelProps) => {
  const [filesMap, setFilesMap] = useState({})
  const [curPath, setCurPath] = useState([] as Path[])

  const onChangeRef = useRef(null)

  useEffect(() => {
    ;(async () => {
      const data = await getAll()
      setFilesMap((c) => {
        return {
          ...c,
          ['000']: {
            _origin: {},
            type: PathType.Files,
            data,
          },
        }
      })
    })()
  }, [])

  const handleFileSelected = useCallback(
    (file, level) => {
      const { id: fileId, extName } = file ?? {}
      const hasCached = !!filesMap[fileId]

      /** 需要异步加载*/
      if (!hasCached) {
        /** 异步请求数据  */
        switch (true) {
          case extName === 'folder': {
            const _fileId = `folder_${fileId}`

            /** 先设置成加载中  */
            setCurPath((c) => {
              const path = Array.from(c)
              path[level] = { fileId: _fileId, loading: true, type: undefined }
              return path.slice(0, level + 1)
            })
            ;(async () => {
              const data = await getAll({ parentId: file.id })
              setFilesMap((c) => {
                return {
                  ...c,
                  [_fileId]: {
                    type: PathType.Files,
                    data,
                    _origin: file,
                  },
                }
              })

              setCurPath((c) => {
                /** 如果当前用户并没有切换别的文件的话，准备切换成列表 */
                if (c[level].fileId === _fileId) {
                  const path = Array.from(c)
                  path[level] = {
                    fileId: _fileId,
                    loading: false,
                    type: PathType.Files,
                  }
                  return path.slice(0, level + 1)
                }
                /** 如果当前用户已经切换了别的文件，则不变 */
                return c
              })
            })()

            break
          }

          default: {
            /** 先设置成加载中  */
            setCurPath((c) => {
              const path = Array.from(c)
              path[level] = { fileId: fileId, loading: true, type: undefined }
              return path.slice(0, level + 1)
            })
            ;(async () => {
              const data = await getVersions({ fileId })
              const hasVersions = Array.isArray(data) && data.length > 0

              if (hasVersions) {
                /** 文件有发布版本的话，展示发布列表 */
                setFilesMap((c) => {
                  return {
                    ...c,
                    [fileId]: {
                      type: PathType.Versions,
                      data,
                      _origin: file,
                    },
                  }
                })

                setCurPath((c) => {
                  /** 如果当前用户并没有切换别的文件的话，准备切换成列表 */
                  if (c[level].fileId === fileId) {
                    const path = Array.from(c)
                    path[level] = {
                      fileId,
                      loading: false,
                      type: PathType.Versions,
                    }
                    return path.slice(0, level + 1)
                  }
                  /** 如果当前用户已经切换了别的文件，则不变 */
                  return c
                })
              } else {
                /** 文件没有发布版本，展示文件详情 */
                setFilesMap((c) => {
                  return {
                    ...c,
                    [fileId]: {
                      type: PathType.FileDetail,
                      data: file,
                      _origin: file,
                    },
                  }
                })

                setCurPath((c) => {
                  /** 如果当前用户并没有切换别的文件的话，准备切换成列表 */
                  if (c[level].fileId === fileId) {
                    const path = Array.from(c)
                    path[level] = {
                      fileId,
                      loading: false,
                      type: PathType.FileDetail,
                    }
                    return path.slice(0, level + 1)
                  }
                  /** 如果当前用户已经切换了别的文件，则不变 */
                  return c
                })
              }
            })()
            break
          }
        }

        return
      }

      /** 不需要异步加载 */
      setCurPath((c) => {
        const path = Array.from(c)
        path[level] = { fileId, loading: false, type: filesMap[fileId]?.type }
        return path.slice(0, level + 1)
      })
    },
    [filesMap]
  )

  const handleVersionSelected = useCallback(
    (version, level) => {
      const fileId = `version_${version?.id}`

      const hasCached = !!filesMap[fileId]

      if (!hasCached) {
        setFilesMap((c) => {
          return {
            ...c,
            [fileId]: {
              type: PathType.FileDetail,
              data: version,
              _origin: version,
            },
          }
        })
      }

      setCurPath((c) => {
        const path = Array.from(c)
        path[level] = { fileId, loading: false, type: PathType.VersionDetail }
        return path.slice(0, level + 1)
      })
    },
    [filesMap]
  )

  const FilesRender = useCallback(
    ({ files, selectedPath, level }) => {
      return (
        <div className={styles.filesRender}>
          {(files ?? []).map((file) => {
            const disabled =
              Array.isArray(allowedFileExtNames) &&
              allowedFileExtNames.length > 0
                ? !(allowedFileExtNames.concat('folder')).includes(file.extName)
                : false
            return (
              <div
                className={`${styles.file} ${
                  file?.id === selectedPath?.fileId ? styles.selected : ''
                } ${disabled ? styles.disabled : ''}`}
                onClick={() => !disabled && handleFileSelected(file, level)}
              >
                <div className={styles.fileLeft}>
                  {false && (
                    <img className={styles.fileIcon} src={file?.icon} />
                  )}
                  <span
                    className={styles.fileName}
                  >{`${file?.name}.${file?.extName}`}</span>
                </div>
                <div className={styles.fileRight}>
                  {file?.extName === 'folder' && (
                    <RightOutlined className={styles.fileArrow} />
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )
    },
    [handleFileSelected, allowedFileExtNames]
  )

  const LoadingRender = useCallback(() => {
    return <div className={styles.loadingRender}>加载中...</div>
  }, [])

  const FileDetailRender = useCallback(({ file }) => {
    return (
      <div className={styles.fileDetailRender}>
        <div className={styles.image}>
          <img src="https://ali-ec.static.yximgs.com/kos/nlav11092/apps/file.d64916fe3c951caa.svg" />
        </div>
        <div className={styles.name}>{`${file?.name}.${file?.extName}`}</div>
        {file?.creatorName && (
          <div className={styles.rowInfo}>
            <span>作者</span>
            <span>{file?.creatorName}</span>
          </div>
        )}
        {file?.createTime && (
          <div className={styles.rowInfo}>
            <span>创建时间</span>
            <span>{file?.createTime}</span>
          </div>
        )}
        {file?.updateTime && (
          <div className={styles.rowInfo}>
            <span>更新时间</span>
            <span>{file?.updateTime}</span>
          </div>
        )}
      </div>
    )
  }, [])

  const VersionsRender = useCallback(({ versions, selectedPath, level }) => {
    return (
      <div className={styles.versionsRender}>
        {(versions ?? []).map((version) => {
          return (
            <div
              className={`${styles.version} ${
                `version_${version?.id}` === selectedPath?.fileId
                  ? styles.selected
                  : ''
              }`}
              onClick={() => handleVersionSelected(version, level)}
            >
              <div
                className={styles.versionName}
              >{`${version.type}@${version.version}`}</div>
            </div>
          )
        })}
      </div>
    )
  }, [])

  const VersionDetailRender = useCallback(({ version }) => {
    return (
      <div className={styles.versionDetailRender}>
        <div className={styles.image}>
          <img src="https://ali-ec.static.yximgs.com/kos/nlav11092/apps/file.d64916fe3c951caa.svg" />
        </div>
        <div className={styles.name}>
          {`${version?.type}@${version?.version}`}
        </div>
        {version?.creatorId && (
          <div className={styles.rowInfo}>
            <span>作者</span>
            <span>{version?.creatorId}</span>
          </div>
        )}
        {version?.createTime && (
          <div className={styles.rowInfo}>
            <span>创建时间</span>
            <span>{version?.createTime}</span>
          </div>
        )}
      </div>
    )
  }, [])

  const pathesData = useMemo((): Path[] => {
    const pathes = [
      {
        fileId: '000',
        loading: false,
        type: PathType.Files,
      },
      ...curPath,
    ]
    return pathes as Path[]
  }, [curPath])

  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  useEffect(() => {
    const _path = Array.from(curPath).reverse()
    const res = _path.reduce((acc, cur) => {
      /** VersionDetail的上一层是Version */
      if (cur.type === PathType.VersionDetail) {
        const { id, type, version, fileContentId } =
          filesMap[cur.fileId]?._origin || {}
        return {
          ...acc,
          version: {
            id,
            type,
            version,
            fileContentId,
          },
        }
      }

      /** FileDetail的上一层是File */
      if (cur.type === PathType.FileDetail) {
        const { id, name, extName, icon, type } =
          filesMap[cur.fileId]?._origin || {}
        return {
          ...acc,
          id,
          name,
          extName,
          icon,
          type,
        }
      }

      /** Versions的上一层是File */
      if (cur.type === PathType.Versions) {
        const { id, name, extName, icon, type } =
          filesMap[cur.fileId]?._origin || {}
        return {
          ...acc,
          id,
          name,
          extName,
          icon,
          type,
        }
      }

      return {
        ...(acc || {}),
      }
    }, {})
    onChangeRef.current?.(res)
  }, [curPath, filesMap])

  return (
    <div className={styles.openPanel}>
      <div className={styles.filesList}>
        {pathesData.map((path, level) => {
          const selectedPath = curPath[level]
          switch (true) {
            case path?.loading: {
              return <LoadingRender />
            }

            case path.type === PathType.Files: {
              return (
                <FilesRender
                  files={filesMap[path.fileId]?.data}
                  selectedPath={selectedPath}
                  level={level}
                />
              )
            }

            case path.type === PathType.Versions: {
              return (
                <VersionsRender
                  versions={filesMap[path.fileId]?.data}
                  selectedPath={selectedPath}
                  level={level}
                />
              )
            }

            case path.type == PathType.FileDetail: {
              return <FileDetailRender file={filesMap[path.fileId]?.data} />
            }

            case path.type == PathType.VersionDetail: {
              return (
                <VersionDetailRender version={filesMap[path.fileId]?.data} />
              )
            }

            default: {
              return null
            }
          }
        })}
      </div>
    </div>
  )
}

export default ({
  canChooseFiles = true,
  canChooseDirectories = false,
  allowsMultipleSelection = false,
  allowedFileExtNames,
}: openPanelProps) => {
  let selectedFile
  return new Promise((resolve, reject) => {
    SingleModal.show({
      wrapClassName: 'fangzhou-theme',
      title: '文件选择',
      closeIcon: '',
      width: 800,
      maskClosable: false,
      className: styles.fileOpenModal,
      content: (
        <FilePanel
          allowedFileExtNames={allowedFileExtNames}
          canChooseDirectories={canChooseDirectories}
          onChange={(file) => {
            selectedFile = file
          }}
        />
      ),
      okText: '选择',
      cancelText: '取消',
      onOk: (e) => {
        if (Object.keys(selectedFile).length === 0) {
          reject(new Error('未选择文件'))
          SingleModal.hide()
          return
        }
        resolve(selectedFile)
        SingleModal.hide()
      },
      onCancel: () => {
        reject(new Error('未选择文件'))
      },
    })
  })
}
