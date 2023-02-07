import React, {forwardRef, ForwardRefRenderFunction, useImperativeHandle, useLayoutEffect, useMemo, useState} from "react";
import {message} from 'antd';
import { FileContent, ViewProps, ViewRef, IInstalledApp, IConfig, API_CODE } from '../../type'
import API from '../../api/index'
import {getUrlParam, safeParse} from '../util';

import css from './css.less'

type T_Props = {
  onLoad: (props: {
    fileId: number;
    user: any;
    installedApps: any[];
    fileContent: any;
    config: any
  }) => {}
}

const DefaultConfig: IConfig = {
  system: {}
}


export default function View({onLoad}: T_Props) {
  const [jsx, setJSX] = useState('加载中..')
  const [user, setUser] = useState<any>({});
  const [config, setConfig] = useState<IConfig>(DefaultConfig);
  const [installedApps, setInstalledApps] = useState([]);
  const [content, setContent] = useState<FileContent | null>(null);
  const fileId = useMemo(() => Number(getUrlParam('id') ?? '0'), []);

  useMemo(() => {
    (async () => {
      try {
        const loginUser: any = await API.User.getLoginUser()
        setUser(user => ({...loginUser, isAdmin: loginUser?.isAdmin}));
        const apps: any = await API.App.getInstalledList()
        console.log('!!!', loginUser, apps)
        setInstalledApps(apps);
      } catch(e: any) {
        message.error(`应用初始化数据失败, ${e.message}`);
      }
    })()
  }, [])

  useMemo(async () => {
    if (fileId) {
      try {
        const data = await API.File.getFullFile({userId: user.email, fileId})
        // @ts-ignore
        setContent({...data, content: safeParse(data.content)});
      } catch (e: any) {
        message.error(`获取页面数据发生错误：${e.message}`);
      }
    }
  }, [fileId]);

  useLayoutEffect(() => {
    const nodes = onLoad({
      user,
      get installedApps() {
        return installedApps;
      },
      get fileId() {
        return fileId;
      },
      get fileContent() {
        /** 防止外层对 content 进行修改 */
        return content ? JSON.parse(JSON.stringify(content)) : {};
      },
      get config() {
        return JSON.parse(JSON.stringify(config));
      },
    })
    console.log('####', nodes)
    setJSX(nodes as any)
  }, [])

  return (
    <div className={css.view}>
      {jsx}
    </div>
  )
}