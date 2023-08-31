import React, {
  useRef,
  useMemo,
  useState,
  useEffect,
  useContext,
  useCallback,
  createContext
} from 'react'
import { createPortal } from 'react-dom'

import { SettingOutlined } from '@ant-design/icons'

// import PluginTools from './src/plugintools'
import useToast from './components/toast'
import MSwitch from './components/switch'

import type { ChangeEvent } from 'react'

import css from './index.less'
import styles from './temp.less'

interface ToolsProps {
  // 导入
  onImport: (value: any) => void
  // 导出dump
  getExportDumpJSON: () => any
  // 导出tojson
  getExportToJSON: () => any
}

const ToolsContext = createContext<ToolsProps>({} as any)

export function useToolsContext () {
  const context = useContext(ToolsContext)

  return context
}

export default function Tools (props: ToolsProps) {
  const toolsRef = useRef<HTMLDivElement>(null)
  const { render, show, setShow } = useKeep()

  const renderPopupPanel = useMemo(() => {
    return (
      <PopupPanel
        open={show}
        getContainer={() => {
          return toolsRef.current
        }}
      />
    )
  }, [show])

  return (
    <div
      ref={toolsRef}
      className={css.tools}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <SettingOutlined />
      <ToolsContext.Provider value={props}>
        {render && renderPopupPanel}
      </ToolsContext.Provider>
    </div>
  )
}

function useKeep () {
  const [render, setRender] = useState(false)
  const [show, setInternalShow] = useState(false)

  const setShow = useCallback((show) => {
    setRender(true)
    setInternalShow(show)
  }, [])

  return {
    render,
    show,
    setShow
  }
}

function PopupPanel({ open, getContainer }) {
  const toolsContext = useToolsContext()
  const [toast, contextHolder] = useToast()
  const fileRef = useRef<HTMLInputElement>(null)
  const [toJsonVisible, setToJsonVisible] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  const container = useMemo(() => {
    return getContainer()
  }, [])

  const onImport = useCallback(async () => {
    try {
      const importData = await navigator.clipboard.readText()

      toolsContext.onImport(importData)
    } catch (err) {
      console.warn(err, '剪切板读取失败，尝试切换为手动导入...')

      const importData = window.prompt('将导出的页面数据复制到输入框')

      if (importData) {
        toolsContext.onImport(importData)
      }
    }
  }, [])

  const onExport = useCallback(() => {
    copyText(JSON.stringify(toolsContext.getExportDumpJSON()))
    toast.success('已导出到剪贴板')
  }, [])

  const handleFileChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files

    if (files) {
      const reader = new FileReader()
      reader.readAsText(files[0])
      reader.onload = (v) => {
        const text = v.target?.result as string
        toolsContext.onImport(text)
      }
    }
  }, [])

  const onImportForFile = useCallback(() => {
    fileRef.current?.click()
  }, [])

  const onExportToFile = useCallback(() => {
    downloadToFile({ name: `mybricks_dump_${getDateTime()}.json`, content: toolsContext.getExportDumpJSON() })
  }, [])

  const onChange = useCallback((val) => {
    setToJsonVisible(val)
  }, [])

  const onExportToJson = useCallback(() => {
    copyText(JSON.stringify(toolsContext.getExportToJSON()))
    toast.success('已导出到剪贴板')
  }, [])

  const onExportToFileToJson = () => {
    downloadToFile({ name: `mybricks_tojson_${getDateTime()}.json`, content: toolsContext.getExportToJSON() })
  }

  useEffect(() => {
    const panelEle = panelRef.current!
    if (open) {
      const containerBct = container.getBoundingClientRect()
      panelEle.style.top = containerBct.height + 'px'
      panelEle.style.zIndex = '2'
      panelEle.style.visibility = 'visible'
    } else {
      panelEle.style.zIndex = '-1'
      panelEle.style.visibility = 'hidden'
    }
  }, [open])

  return createPortal((
    <div ref={panelRef} className={css.panel}>
      <>
        <div className={styles.toolsContainer}>
          {/* <div className={styles.toolsTitle}>调试工具</div> */}
          <div className={styles.toolsContent}>
            <div className={styles.toolsItem}>
              <div className={styles.toolsItemTitle}>页面协议（Dump）</div>
              <div className={styles.toolsItemContent}>
                
                <button className={`${styles.toolsIBtn} ${styles.toolsIBtnBlock}`} onClick={() => onImport()}>从剪切板中导入</button>
                <button className={`${styles.toolsIBtn} ${styles.toolsIBtnBlock}`} onClick={() => onExport()}>导出到剪切板</button>
                <div>
                  <input
                    style={{ display: 'none' }}
                    ref={fileRef}
                    type="file"
                    accept="application/json"
                    onChange={handleFileChange}
                  />
                  <button
                    className={`${styles.toolsIBtn} ${styles.toolsIBtnBlock}`}
                    onClick={() => onImportForFile()}>从文件中导入</button>
                </div>

                <button className={`${styles.toolsIBtn} ${styles.toolsIBtnBlock}`} onClick={() => onExportToFile()}>导出到文件</button>
              </div>
            </div>
            <div>
              
            </div>
            <div className={styles.toolsItem}>
              <div className={styles.toolsItemTitle}>
                <div>页面产物（ToJSON）</div>
                <div>
                  <MSwitch onChange={onChange} />
                </div>
              </div>
              {
                toJsonVisible && (
                  <div className={styles.toolsItemContent}>
                    <button className={`${styles.toolsIBtn} ${styles.toolsIBtnBlock}`} onClick={() => onExportToJson()}>导出到剪切板</button>
                    <button className={`${styles.toolsIBtn} ${styles.toolsIBtnBlock}`} onClick={() => onExportToFileToJson()}>导出到文件</button>
                  </div>
                )
              }
              
            </div>

          </div>
        </div>
        {contextHolder}
      </>
    </div>
  ), container)
}

function getDateTime() {
  const date = new Date()
  const Y = date.getFullYear() + '-'
  const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
  const D = date.getDate() + ' '
  const h = date.getHours() + ':'
  const m = date.getMinutes() + ':'
  const s = date.getSeconds()

  return Y + M + D + h + m + s
}


function copyText(txt: string): boolean {
  const input = document.createElement('input')
  document.body.appendChild(input)
  input.value = txt
  input.select()
  document.execCommand('copy')
  document.body.removeChild(input)
  return true;
}

function downloadToFile ({ content, name }: { content: any, name: string }) {
  const eleLink = document.createElement('a')
  eleLink.download = name
  eleLink.style.display = 'none'

  const blob = new Blob([JSON.stringify(content)])

  eleLink.href = URL.createObjectURL(blob)
  document.body.appendChild(eleLink)
  eleLink.click()
  document.body.removeChild(eleLink)
}
