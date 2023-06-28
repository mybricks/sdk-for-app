import React, {
  useMemo,
  useState,
  useEffect,
  useContext,
  useCallback
} from 'react'

import {
  Form,
  Spin,
  Popover,
  message,
  Modal,
  Input,
  Checkbox
} from 'antd';
import axios from 'axios';
import { DownOutlined } from '@ant-design/icons'

import GlobalContext from '../globalContext';

// @ts-ignore
import css from './index.less'

const FormItem = Form.Item
const TextArea = Input.TextArea

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

  permissionRequest?: {
    show: boolean
    group?: boolean
  }
}

// @ts-ignore
const isMock = typeof ENV !== 'undefined' &&  ENV === 'DEV'

function Locker(props: LockerProps): JSX.Element {
  const { user, fileId, fileContent } = useContext(GlobalContext)

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
  
    return <UI user={user} fileId={fileId} fileContent={fileContent} lockerProps={{...defaultProps, ...props}}/>
  }, [])

  return render
}

function UI({user, fileId, fileContent, lockerProps}: {user, fileId, fileContent, lockerProps: LockerProps}) {
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
      {lockerProps.permissionRequest?.show ? <LockerInfo useGroup={lockerProps.permissionRequest.group} roleDescription={roleDescription} fileContent={fileContent} userId={user.email}/> : <></>}
      {CooperationUsersList}
    </div>
  )
}

export const ROLE_DESCRIPTION_OPTIONS = [
  { title: '可查看', description: '查看', roleDescription: 3 },
  { title: '可编辑', description: '查看和编辑', roleDescription: 2 },
]

export const ROLE_DESCRIPTION_NUM_TO_EXP = {
  1: '可管理',
  2: '可编辑',
  3: '可查看'
}

function LockerInfo ({roleDescription, fileContent, userId, useGroup}) {
  const [open, setOpen] = useState(false)
  const [visible, setVisible] = useState(false)

  return (
    <>
      <Popover
        placement='bottomRight'
        overlayStyle={{width: 250}}
        visible={open}
        onVisibleChange={(bool) => {
          setOpen(bool)
        }}
        content={() => {
          const options = ROLE_DESCRIPTION_OPTIONS.slice(3 - roleDescription)
          return (
            <div className={css.accessLevelGroup}>
              {options.map((option, idx) => {
                const { title, roleDescription, description } = option
                return (
                  <div key={title} className={css.accessLevelGroupItem}>
                    <div className={css.optionLeft}>
                      <div className={css.accessLevelTitle}>
                        {title}
                      </div>
                      <div className={css.accessLevelDescription}>
                        {description}
                      </div>
                    </div>
                    <div className={css.optionRight}>
                      {idx ? <span className={css.applyBtn} onClick={() => {
                        setOpen(false)
                        setVisible(roleDescription)
                      }}>申请</span> : iconGou}
                    </div>
                  </div>
                )
              })}
            </div>
          )
        }}
      >
        <div className={css.accessLevelMount}>
          <span>{ROLE_DESCRIPTION_NUM_TO_EXP[roleDescription]}</span>
          <DownOutlined className={css.icon} title={'icon'}/>
        </div>
      </Popover>
      <ApplyModal
        open={visible}
        onCancel={() => setVisible(false)}
        fileContent={fileContent}
        roleDescription={roleDescription}
        userId={userId}
        useGroup={useGroup}
      />
    </>
  )
}

const TYPE_TO_EXP = {
  'file': '当前文件',
  'group': '当前协作组(推荐)'
}

function ApplyModal({open, onCancel, fileContent, roleDescription, userId, useGroup}) {
  const [form] = Form.useForm()
  const [state, setState] = useState({
    admins: [],
    open: false,
    loading: true,
    confirmLoading: false,
    currentAccessLevel: 3,
    currentType: 'file'
  })

  const adminsInit = useCallback(() => {
    const { id, groupId } = fileContent

    axios({
      method: 'get',
      url: `/api/file/getAuthorizedUsers?groupId=${groupId}&fileId=${id}`
    }).then(({data: {code, data}}) => {
      if (code === 1 && Array.isArray(data) && data.length) {
        data = data.concat({name: 'leon', avatar: null, email: 'leon@leon'})
        data.forEach((d, idx) => {
          if (!idx) {
            d.selected = true
          } else {
            d.selected = false
          }
        })
        setState((state) => {
          return {
            ...state,
            loading: false,
            admins: data
          }
        })
      } else {
        message.info('未查询到可审批人')
        onCancel()
      }
    }).catch(e => {
      message.error(`查询可审批人失败：${e?.message || e?.msg}`)
      console.error(e)
      onCancel()
    })
  }, [])

  useEffect(() => {
    if (open) {
      setState((state) => {
        return {
          ...state,
          open: true,
          loading: true,
          currentAccessLevel: open,
          currentType: fileContent.groupId ? 'group' : 'file',
        }
      })
      adminsInit()
    } else {
      setState({
        admins: [],
        open: false,
        loading: true,
        confirmLoading: false,
        currentAccessLevel: 3,
        currentType: 'file'
      })
    }
  }, [open])

  const onOk = useCallback(() => {
    const { id, groupId } = fileContent
    const { admins, currentAccessLevel, currentType } = state
    const formValues = form.getFieldsValue()

    setState((state) => {
      return {
        ...state,
        confirmLoading: true
      }
    })

    const params: any = {
      admins: admins.filter(admin => currentType === 'file' ? admin.selected : admin.roleDescription === '1' && admin.selected).map(admin => admin.email),
      roleDescription: currentAccessLevel,
      reason: formValues.reason,
      userId
    }

    if (currentType === 'file') {
      params.fileId = id
    } else {
      params.groupId = groupId
    }

    axios({
      method: 'post',
      url: '/paas/api/notice/push',
      data: {
        params,
        type: 'applyRoleDescription'
      }
    }).then(() => {
      message.success('申请成功已通知审批人')

      onCancel()
    }).catch((e) => {
      message.info(`申请失败：${e.message}`)
    })
  }, [state])

  const render = useMemo(() => {
    const { admins, currentAccessLevel, currentType } = state

    let firstSelect
    let selecteds = []
    let selectedCount = 0

    const selectAdmins = admins.filter(admin => currentType === 'group' ? admin.roleDescription === '1' : true)

    selectAdmins.forEach(admin => {
      const { selected } = admin
      if (selected && !firstSelect) {
        firstSelect = admin
      }

      selectedCount = selectedCount + (selected ? 1 : 0)
      selecteds.push(admin.selected)
    })
    if (!firstSelect && selectAdmins.length) {
      firstSelect = selectAdmins[0]
      selectAdmins[0].selected = true
      selecteds[0] = true
      selectedCount = 1
    }

    const options = ROLE_DESCRIPTION_OPTIONS.slice(4 - roleDescription)
    const typeOptions = [{title: '当前文件', type: 'file', description: '当前文件的权限'}]

    if (fileContent.groupId && useGroup) {
      typeOptions.unshift({title: '当前协作组(推荐)', type: 'group', description: '当前文件所在协作组内所有文件的权限'})
    }

    return (
      <Modal
        title='权限申请'
        visible={!!state.open}
        onOk={onOk}
        onCancel={onCancel}
        confirmLoading={state.confirmLoading}
        getContainer={() => document.body}
        okButtonProps={{
          disabled: state.loading
        }}
        okText='确定'
        cancelText='取消'
      >
        <Spin spinning={state.loading}>
          <Form form={form}>
            <FormItem>
              <div className={css.permissionApplyTitle}>
                向
                <Popover
                  placement='bottomLeft'
                  overlayStyle={{width: 250}}
                  content={() => {
                    return (
                      <div className={css.filterGroup}>
                        <div className={css.filterGroupTitle}>审批人</div>
                        {selectAdmins.map((admin, idx) => {
                          const { avatar, name, email } = admin

                          return (
                            <div className={css.filterGroupItem} onClick={() => {
                              if (!admin.selected) {
                                admin.selected = true
                                setState((state) => {
                                  return {
                                    ...state,
                                    admins
                                  }
                                })
                              } else {
                                const selectedAdmins = selectAdmins.filter(admin => admin.selected)
                                if (selectedAdmins.length > 1) {
                                  admin.selected = false
                                  setState((state) => {
                                    return {
                                      ...state,
                                      admins
                                    }
                                  })
                                } else {
                                  message.info('请至少选择一位审批人')
                                }
                              }
                            }}>
                              <Checkbox checked={selecteds[idx]}/>
                              <span><img src={avatar}/></span>
                              <span>{name || email}</span>
                            </div>
                          )
                        })}
                      </div>
                    )
                  }}
                >
                  <div className={css.permissionApplyTitleSpecial}>
                    <span>
                      <div className={css.avatar}>
                        <img src={firstSelect?.avatar && firstSelect?.avatar}/>
                      </div>
                    </span>
                    <span className={css.currentManagerUserName}>
                      {firstSelect?.name} {selectedCount > 1 && `等${selectedCount}人`}
                    </span>
                    <DownOutlined className={css.icon} title='icon'/>
                  </div>
                </Popover>
                申请
                <Popover
                  placement='bottomLeft'
                  overlayStyle={{width: 250}}
                  content={() => {
                    return (
                      <div className={`${css.accessLevelGroup} ${css.accessLevelGroup2}`}>
                        {typeOptions.map((option) => {
                          const { title, type, description } = option
                          const selected = type === currentType

                          return (
                            <div key={title} className={`${css.accessLevelGroupItem} ${selected ? css.accessLevelSelected : ''}`} onClick={() => {
                              setState((state) => {
                                return {
                                  ...state,
                                  currentType: type
                                }
                              })
                            }}>
                              <div className={css.optionLeft}>
                                <div className={css.accessLevelTitle}>
                                  {title}
                                </div>
                                <div className={css.accessLevelDescription}>
                                  {description}
                                </div>
                              </div>
                              <div className={css.optionRight}>
                                {selected && iconGou}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )
                  }}
                >
                  <div className={css.permissionApplyTitleSpecial}>
                    <span className={css.currentManagerUserName}>
                      {TYPE_TO_EXP[currentType]}
                    </span>
                    <DownOutlined className={css.icon} title='icon'/>
                  </div>
                </Popover>
                的
                <Popover
                  placement='bottomLeft'
                  overlayStyle={{width: 250}}
                  content={() => {
                    return (
                      <div className={`${css.accessLevelGroup} ${css.accessLevelGroup2}`}>
                        {options.map((option) => {
                          const { title, roleDescription , description } = option
                          const selected = roleDescription === currentAccessLevel

                          return (
                            <div key={title} className={`${css.accessLevelGroupItem} ${selected ? css.accessLevelSelected : ''}`} onClick={() => {
                              setState((state) => {
                                return {
                                  ...state,
                                  currentAccessLevel: roleDescription
                                }
                              })
                            }}>
                              <div className={css.optionLeft}>
                                <div className={css.accessLevelTitle}>
                                  {title}
                                </div>
                                <div className={css.accessLevelDescription}>
                                  {description}
                                </div>
                              </div>
                              <div className={css.optionRight}>
                                {selected && iconGou}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )
                  }}
                >
                  <div className={css.permissionApplyTitleSpecial}>
                    <span className={css.currentManagerUserName}>
                      {ROLE_DESCRIPTION_NUM_TO_EXP[currentAccessLevel]}
                    </span>
                    <DownOutlined className={css.icon} title='icon'/>
                  </div>
                </Popover>
                权限
              </div>
            </FormItem>
            <FormItem name='reason'>
              <TextArea 
                placeholder={`申请理由（选填，50字）`}
                autoFocus
                maxLength={50}
              />
            </FormItem>
          </Form>
        </Spin>
      </Modal>
    )
  }, [state])

  return render
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

const iconGou = (
  <svg width='20px' height='20px' fill="#0c63fa" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="26978">
    <path d="M891.861333 255.637333l21.12 21.12a27.733333 27.733333 0 0 1 0 39.210667L464.96 763.989333a42.666667 42.666667 0 0 1-57.642667 2.496l-2.709333-2.496L149.589333 508.970667a27.733333 27.733333 0 0 1 0-39.210667l21.12-21.12a27.733333 27.733333 0 0 1 39.210667 0l224.853333 224.853333 417.856-417.856a27.733333 27.733333 0 0 1 39.232 0z"/>
  </svg>
)