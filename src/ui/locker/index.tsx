import React, {
  useMemo,
  useState,
  useEffect,
  useContext,
  useCallback
} from 'react'

import axios from 'axios';
import { Spin, Popover, message } from 'antd'

import GlobalContext from '../globalContext';

// @ts-ignore
import css from './index.less'

/** 用户信息 */
interface User {
  /** 头像 */
  avatar?: string
  /** 名称 */
  name?: string
  /** 邮箱/账号 */
  userId: string
  /**
   * 状态
   * 0 在线
   * 1 在线编辑
   */
  status?: Status
}

type RoleDescription = 1 | 2 | 3

type Status = -1 | 0 | 1

export interface LockerProps {
  /** 是否轮询，默认开启 */
  pollable?: boolean
  /** 编辑状态变更 1: 可编辑，其余均为查看 */
  statusChange?: (status: Status) => void
}

// @ts-ignore
const isMock = typeof ENV !== 'undefined' &&  ENV === 'DEV'

function Locker(props: LockerProps): JSX.Element {
  const { user, fileId } = useContext(GlobalContext)

  const render = useMemo(() => {
    if (isMock || !user?.email || !fileId) {
      if (isMock) {
        props.statusChange?.(1)
      }
      return <></>
    }

    const defaultProps = {
      pollable: true
    }
  
    return <UI user={user} fileId={fileId} lockerProps={{...defaultProps, ...props}}/>
  }, [])

  return render
}

function UI({user, fileId, lockerProps}: {user, fileId, lockerProps: LockerProps}) {
  const [lockerContext] = useState<{
    timer: number | null,
    setTimer: () => void,
    clearTimer: () => void
  }>({
    timer: null,
    setTimer() {
      // 立即执行
      polling()
      if (!lockerContext.timer && lockerProps.pollable) {
        lockerContext.timer = window.setInterval(() => {
          // 轮询执行
          polling()
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
  const [roleDescription, setRoleDescription] = useState<RoleDescription>(3)
  const [operationLoading, setOperationLoading] = useState(false)

  useEffect(() => {
    location.href.indexOf('DEBUG') === -1 ? lockerContext.setTimer() : null

    return () => {
      lockerContext.clearTimer()
    }
  }, [])

  /** 轮询 */
  const polling: () => Promise<{users: User[], roleDescription: RoleDescription}> = useCallback(() => {
    return new Promise((resolve) => {
      getFileCooperationUsers({userId: user.email, fileId}).then(({users, roleDescription}) => {
        setCooperationUsers(users)
        setRoleDescription(roleDescription)
        lockerProps.statusChange?.((users.find((item) => item.userId === user.email))?.status || 0)
        resolve({users, roleDescription})
      }).catch((e) => {
        console.error(e)
      })
    })
  }, [])

  const lockToggle = useCallback((cooperationUser) => {
    setOperationLoading(true)
    const status = cooperationUser.status === 1 ? 0 : 1
    return new Promise(() => {
      axios({
        method: 'post',
        url: '/api/file/toggleFileCooperationStatus',
        data: {
          userId: user.email,
          fileId,
          status
        }
      }).then(({data}) => {
        if (data.data) {
          if (status === 1) {
            message.success('上锁成功')
          } else {
            message.success('解锁成功')
          }
        } else {
          message.error(data.message)
        }
      }).finally(async () => {
        polling()
        setOperationLoading(false)
      })
    })
  }, [])

  const avatarClick = useCallback((cooperationUser) => {
    if (operationLoading) return
    const { email } = user
    const { userId } = cooperationUser
    if (email !== userId) return

    if ([1, 2].includes(roleDescription)) {
      lockToggle(cooperationUser)
    } else {
      setOperationLoading(true)
      polling().then(async ({roleDescription}) => {
        if ([1, 2].includes(roleDescription)) {
          lockToggle(cooperationUser)
        } else {
          message.info('没有当前文件的操作权限')
          setOperationLoading(false)
        }
      }).catch((e) => {
        console.error(e)
        setOperationLoading(false)
      })
    }
  }, [operationLoading, roleDescription])

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

    const { email } = user

    return (
      <div className={css.cooperationUsersList}>
        {showCooperationUsers.map((user) => {
          return (
            <Popover
              key={user.userId}
              placement='bottom'
              overlayClassName={css.overlayUsersListPopover}
              content={() => {
                return (
                  <div className={css.userInfo}>{user.userId}</div>
                )
              }}
            >
              <div className={css.userAvatar} onClick={() => avatarClick(user)}>
                <Spin spinning={operationLoading && email === user.userId} size={'small'}>
                  {user.avatar ? (
                    <img src={user.avatar}/>
                  ) : (
                    <div className={css.userCount}>{(user.name || user.userId).slice(0, 1)}</div>
                  )}
                  {user.status === 1 && <span className={css.activeDot}>
                    <span className={css.animate}></span>
                  </span>}
                </Spin>
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
  }, [operationLoading, cooperationUsers]);
  
  return (
    <div className={css.locker}>
      {CooperationUsersList}
    </div>
  )
}

/** 获取协作用户信息 */
async function getFileCooperationUsers ({userId, fileId}): Promise<{users: User[], roleDescription: RoleDescription}> {
  return new Promise((resolve, reject) => {
    axios({
      method: 'get',
      url: `/api/file/getCooperationUsers?userId=${userId}&fileId=${fileId}`
    }).then((res) => {
      const { code, data } = res.data || {}
      if (res.status === 200 && code === 1) {
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
