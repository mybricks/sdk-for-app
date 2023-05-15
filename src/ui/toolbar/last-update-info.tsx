import React, {
  useContext,
  useCallback,
  useState,
  useMemo,
} from 'react'
import { Divider } from 'antd'
import dayjs from 'dayjs'
import { Loading } from './loading'

import globalContext from '../globalContext'

// @ts-ignore
import css from './last-update-info.less'

const NullComp = () => null

const ClockCircleOutlined = window?.icons?.ClockCircleOutlined || NullComp
const LoadingOutlined = window?.icons?.LoadingOutlined || NullComp

export default function LastUpdate({
  loading = false,
  content = '',
  onClick = () => {},
}) {
  const { fileContent } = useContext(globalContext)

  const _content = useMemo(() => {
    return content || (fileContent?._saveTime
      ? `改动已保存-${UpdateTime(fileContent?._saveTime)}`
      : `${fileContent?.updatorName ?? ''}保存于${UpdateTime(
          fileContent?._updateTime
        )}`)
  }, [content, fileContent?._saveTime, fileContent?.updatorName, fileContent?._updateTime])

  const Tip = useMemo(() => {
    return (
      <Loading
        loadStatus={loading}
        render={
          <>
            <ClockCircleOutlined className={css.clockIcon} />
            <span>{_content}</span>
          </>
        }
        renderLoading={
          <>
            <LoadingOutlined className={css.clockIcon} />
            <span>正在保存...</span>
          </>
        }
      />
    )
  }, [_content, loading])

  return (
    <div className={css.lastUpdate}>
      <Divider type="vertical" style={{ marginLeft: 0 }} />
      <div className={css.content} onClick={onClick}>
        {Tip}
      </div>
    </div>
  )
}

/**
 * 获取所需展示的时间
 * @param time 时间
 * @returns    最终展示的时间格式
 */
function UpdateTime(time: string | number): string {
  if (isToday(time)) {
    return dayjs(time).format('HH:mm')
  } else if (isThisYear(time)) {
    return dayjs(time).format('M月D日 HH:mm')
  }

  return dayjs(time).format('YYYY年M月D日')
}

/**
 * 判断时间是否今天
 * @param time 时间
 * @returns    是否今天
 */
function isToday(time: string | number): boolean {
  const t = dayjs(time).format('YYYY-MM-DD')
  const n = dayjs().format('YYYY-MM-DD')

  return t === n
}

/**
 * 判断时间是否今年
 * @param time 时间
 * @returns    是否今年
 */
function isThisYear(time: string | number): boolean {
  const t = dayjs(time).format('YYYY')
  const n = dayjs().format('YYYY')

  return t === n
}
