import React, {
  useMemo,
  useState,
  useEffect,
  useContext,
  useCallback
} from 'react'

import axios from 'axios';
import { Popover } from 'antd'

import GlobalContext from '../../_ori/ui/globalContext';

import css from './index.less'

/** 用户信息 */
interface User {
  /** 头像 */
  avatar?: string
  /** 邮箱/账号 */
  email: string

  /**
   * 状态
   * 0 在线
   * 1 在线编辑
   */
  status?: Status
}

type Status = -1 | 0 | 1

export interface LockerProps {
  statusChange?: (status: Status) => void
}

// @ts-ignore
const isMock = typeof ENV !== 'undefined' &&  ENV === 'DEV'

function Locker(props: LockerProps): JSX.Element {
  const { user, fileId } = useContext(GlobalContext)

  const render = useMemo(() => {
    if (isMock || !user?.email || !fileId) {
      return <></>
    }
  
    return <UI user={user} fileId={fileId} lockerProps={props}/>
  }, [])

  return render
}

function UI({user, fileId, lockerProps}) {
  const [lockerContext] = useState<{
    timer: number | null,
    setTimer: ({user, fileId}) => void,
    clearTimer: () => void
  }>({
    timer: null,
    setTimer({user, fileId}) {
      const { email: userId } = user;
      // 立即执行
      polling({userId, fileId})
      if (!lockerContext.timer) {
        lockerContext.timer = window.setInterval(() => {
          // 轮询执行
          polling({userId, fileId})
        }, 1 * 5 * 1000)
      }
    },
    clearTimer() {
      if (lockerContext.timer) {
        window.clearInterval(lockerContext.timer)
        lockerContext.timer = null
      }
    }
  });
  /** 协作用户信息 */
  const [cooperationUsers, setCooperationUsers] = useState<User[]>([])

  useEffect(() => {
    lockerContext.setTimer({user, fileId})

    return () => {
      lockerContext.clearTimer()
    }
  }, [])

  /** 轮询 */
  const polling: (props: {userId: string, fileId: number}) => void = useCallback(({userId, fileId}) => {
    getFileCooperationUsers({userId, fileId}).then((res) => {
      // const rst: any = [];
      // for (let i = 0; i < 21; i++) {
      //   rst.push({...res[0], email: res[0].email + i})
      // }
      // setCooperationUsers(rst)
      setCooperationUsers(res)
    }).catch((e) => {
      console.error(e)
    })
  }, [])

  /** 协作用户ui */
  const CooperationUsersList: JSX.Element = useMemo(() => {
    /** 协作用户数 */
    const userCount = cooperationUsers.length

    if (!userCount) {
      /** 没有协作用户 */
      return <></>
    }

    /** 人数大于5，收起 */
    const hasMore = userCount > 5
    /** 仅展示5个用户信息 */
    const showCooperationUsers = cooperationUsers.slice(0, 5)

    return (
      <div className={css.cooperationUsersList}>
        {showCooperationUsers.map((user) => {
          return (
            <Popover
              key={user.email}
              placement='bottom'
              overlayClassName={css.overlayUsersListPopover}
              content={() => {
                return (
                  <div className={css.userInfo}>{user.email}</div>
                )
              }}
            >
              <div className={css.userAvatar}>
                <img src={user.avatar || 'https://assets.mybricks.world/icon/220006.png'}/>
              </div>
            </Popover>
          )
        })}
        {hasMore && (
          <div className={css.userAvatar}>
            <div className={css.userCount}>
              {userCount > 99 ? '99+' : userCount}
            </div>
          </div>
        )}
      </div>
    )
  }, [cooperationUsers]);
  
  return (
    <div className={css.locker}>
      {CooperationUsersList}
    </div>
  )
}

/** 获取协作用户信息 */
async function getFileCooperationUsers ({userId, fileId}): Promise<User[]> {
  return new Promise((resolve, reject) => {
    axios({
      method: 'get',
      url: `/api/file/getCooperationUsers?userId=${userId}&fileId=${fileId}`
    }).then((res) => {
      const { code, data } = res.data || {}
      if (res.status === 200 && code === 1 && Array.isArray(data)) {
        resolve(data)
      } else {
        reject(res)
      }
    }).catch((e) => {
      reject(e);
    })
  })
}

export default Locker
