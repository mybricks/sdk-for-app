import React, { useMemo } from 'react'
import { Dropdown, Button, Menu } from 'antd'
import styles from './../View.less'

const DownOutlined = window?.icons?.DownOutlined

interface WorkflowOptions {
  [keyname: string]: {
    fileId: number
    version: string
  }
}

interface WorkflowsProps {
  disabled?: boolean
  options?: WorkflowOptions
  onClick?: ({ fileId, version, name }) => void,
  children?: any
}

export default ({ disabled, options, onClick, children }: WorkflowsProps) => {
  const _options = useMemo(() => {
    return Object.keys(options ?? {}).map((keyName) => {
      return {
        label: decodeURI(keyName ?? ''),
        value: decodeURI(keyName ?? ''),
        ...(options?.[keyName] ?? {}),
      }
    })
  }, [options])

  const text = useMemo(() => {
    return children || '发布'
  }, [children])

  if (!Array.isArray(_options)) {
    return null
  }

  if (Array.isArray(_options) && _options.length <= 1) {
    return (
      <Button
        className={styles.toolbarButton}
        disabled={disabled}
        size="small"
        onClick={() =>
          onClick?.({
            fileId: _options[0]?.fileId,
            version: _options[0]?.version,
            name: _options[0]?.label,
          })
        }
      >
        <span/>
        {text}
      </Button>
    )
  }

  return (
    <Dropdown
      disabled={disabled}
      overlay={
        <Menu
          items={_options.map((option) => ({
            label: option?.label,
            key: option?.value,
            onClick: () =>
              onClick?.({
                fileId: option.fileId,
                version: option.version,
                name: option.label,
              }),
          }))}
        />
      }
      placement="bottomRight"
      getPopupContainer={(triggerNode) => triggerNode}
      trigger={['click']}
    >
      <Button size="small" className={styles.toolbarButton}>
        <div />
        {text}
        <DownOutlined />
      </Button>
    </Dropdown>
  )
}