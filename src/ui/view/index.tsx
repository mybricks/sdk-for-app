import React, {forwardRef, ForwardRefRenderFunction, useImperativeHandle, useLayoutEffect, useMemo, useState} from "react";
import {message} from 'antd';
import { FileContent, ViewProps, ViewRef, IInstalledApp, IConfig, API_CODE, T_Props } from '../type'
import API from '../../api/index'
import axios from 'axios';
import SDKModal from '../sdkModal/SDKModal';
import { ComponentSelector } from '../componentSelector/index';
import {getUrlParam, safeParse} from '../util';
import GlobalContext from '../globalContext';
import PreviewStorage from './previewStorage'
// @ts-ignore
import css from './css.less'

const DefaultConfig: IConfig = {
  system: {}
}

export default function View({onLoad, className = ''}: T_Props) {
  const [jsx, setJSX] = useState(<Loading />)
  const [user, setUser] = useState<any>({});
  const [config, setConfig] = useState<IConfig | null>(null);
  const [defaultComlibs, setDefaultComlibs] = useState<any>([]);
  const [installedApps, setInstalledApps] = useState([]);
  const [sdkModalInfo, setSDKModalInfo] = useState<any>({});
  const [materialSelectorInfo, setMaterialSelectorInfo] = useState<any>({});
  const [content, setContent] = useState<FileContent | null>(null);
  const fileId = useMemo(() => Number(getUrlParam('id') ?? '0'), []);
  const appMeta = API.App.getAppMeta();
  const [hierarchy, setHierarchy] = useState({}) // 初始化赋值

  useMemo(() => {
    (async () => {
      try {
        console.log('开始初始化基本数据')
        const loginUserRes: any = await axios.post('/paas/api/user/signed', {
          fileId,
          HAINIU_UserInfo: localStorage.getItem('HAINIU_UserInfo')
        })
        if(loginUserRes?.data?.code !== 1) {
          message.warn(loginUserRes.msg || '登录信息已过期，请重新登录', 2)
          setTimeout(() => {
            if(location.href.indexOf('jumped') === -1) {
              document.cookie = 'mybricks-login-user=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;'
              location.href = `/?jumped=true&redirectUrl=${encodeURIComponent(location.href)}`
            }
          }, 2000)
          return
        }
        const loginUser = loginUserRes?.data?.data;
        setUser({...loginUser, isAdmin: loginUser?.isAdmin});
        const apps: any = await API.App.getInstalledList()
        setInstalledApps(apps);
        const data = await API.File.getFullFile({fileId})
        const app = apps?.find(app => app.namespace === appMeta?.namespace);
        let hierarchyRes: Record<string, unknown> = { projectId: undefined, groupId: undefined };

        if(fileId && fileId != 0) {
          hierarchyRes = (await API.File.getHierarchy({fileId})) || hierarchyRes;
          setHierarchy(hierarchyRes)
        }
        // @ts-ignore
        setContent({...data, content: safeParse(data?.content || "{}")});
        const namespaces = [appMeta?.namespace, 'system', 'mybricks-material'];
        const configRes = await API.Setting.getSetting(
          namespaces,
          hierarchyRes.groupId ? { type: 'all', id: hierarchyRes.groupId } : {}
        );
        const allConfig = typeof configRes === 'string' ? safeParse(configRes) : (configRes || DefaultConfig);
        try {
          /** 合并协作组配置、全局配置 */
          namespaces.forEach(namespace => {
            const groupConfigNamespace = `${namespace}@group[${hierarchyRes.groupId}]`;
            const groupConfig = allConfig[groupConfigNamespace] || {};
            const globalConfig = allConfig[namespace] || {};

            if (hierarchyRes.groupId) {
              allConfig[namespace] = {
                ...globalConfig,
                ...groupConfig,
                appNamespace: globalConfig.appNamespace || groupConfig.appNamespace || namespace,
              };

              if (typeof groupConfig.config !== 'string' && typeof globalConfig.config !== 'string') {
                allConfig[namespace].config = { ...globalConfig.config || {}, ...groupConfig.config || {} };
              } else {
                allConfig[namespace].config = groupConfig.config || globalConfig.config;
              }

              delete allConfig[groupConfigNamespace];
            }
          });
        } catch (e) {
          console.log('合并配置失败', e);
        }

        const componentLibraryNamespaceList = allConfig?.['mybricks-material']?.config?.apps?.find((app) => app.namespace === appMeta?.namespace)?.componentLibraryNamespaceList
        if (Array.isArray(componentLibraryNamespaceList) && componentLibraryNamespaceList.length) {
          const latestComponentLibrarys = await API.Material.getLatestComponentLibrarys(componentLibraryNamespaceList)
          setDefaultComlibs(latestComponentLibrarys)
        }

        setConfig(allConfig);
        document.title = data.name + ` - ${allConfig?.system?.config?.title || app?.title || 'Mybricks-通用无代码开发平台'}`;
        document.querySelector('#favicon')?.setAttribute('href', allConfig?.system?.config?.favicon || '/favicon.ico');
      } catch(e: any) {
        console.log(e)
        message.error(`应用初始化数据失败, ${e.message}`);
      }
    })()
  }, [fileId])

  useLayoutEffect(() => {
    if(user && content && installedApps && config && !!Object.keys(hierarchy).length) {
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
        get meta() {
          return appMeta
        },
        get defaultComlibs() {
          return defaultComlibs
        },
        openUrl({
          url,
          onFailed,
          params = {},
          onSuccess
        }: { url: string, params: any, onSuccess: Function, onFailed: Function }) {
          if(url.startsWith('MYBRICKS://')) {
            const [schema, removeSchemaPart] = url.split('://');
            const [pathPart] = removeSchemaPart?.split('?');
            const [namespace, action] = pathPart?.split('/');
            let urlSchema = '';
            installedApps?.forEach((app: IInstalledApp) => {
              if (app.namespace === namespace) {
                app?.exports?.forEach(e => {
                  if (e.name === action) {
                    urlSchema = e.path;
                  }
                })
              }
            });
            if (!urlSchema) {
              onFailed?.({
                code: -1,
                message: `应用 ${namespace} 未对外暴露 ${action} 能力!`
              })
            } else {
              if (urlSchema.endsWith('html')) {
                setSDKModalInfo({
                  open: true,
                  params,
                  url: urlSchema,
                  onSuccess,
                  onFailed,
                  onClose: () => setSDKModalInfo({open: false}),
                });
              } else if (urlSchema.endsWith('js')) {
                axios.get(urlSchema).then((res) => {
                  try {
                    eval(res.data);
                    let fn;
                    if (window?.[action]?.default) {
                      fn = window?.[action]?.default;
                    } else {
                      fn = window?.[action];
                    }
                    fn({...params, onSuccess, onFailed});
                  } catch (e) {
                    console.log(e);
                  }
                })
              } else {
                console.log('invalid url schema');
              }
            }
          } else if(url.startsWith('http')) {
            setMaterialSelectorInfo({
              open: true,
              ...params,
              url: url,
              onSuccess,
              onFailed,
              onClose: () => setMaterialSelectorInfo({open: false}),
            });
          }
        },
        get projectId() {
          // @ts-ignore
          return hierarchy?.projectId
        },
        get moduleId() {
          // @ts-ignore
          return hierarchy?.moduleId
        },
        get hierarchy() {
          return hierarchy
        },
        get hasMaterialApp() {
          // @ts-ignore
          return (installedApps || [])?.some?.((app) => app?.namespace === 'mybricks-material')
        },
        openPreview({ toJSON, comlibs }) {
          const previewStorage = new PreviewStorage({ fileId })
          previewStorage.savePreviewPageData({
            dumpJson: toJSON,
            comlibs
          })
          window.open(`./preview.html?fileId=${fileId}`)
        },
        report({ jsonData }) {
          try {
            axios.post('/paas/api/system/channel', {
              type: 'report',
              payload: {
                namespace: appMeta?.namespace,
                content: jsonData
              }
            })
          } catch(e) {
            console.log(e)
          }
        }
      })
      setJSX(nodes as any)
    }
  }, [user, fileId, content, config, installedApps, hierarchy]);

  return (
    <GlobalContext.Provider value={{fileContent: content, user, fileId}}>
      <div className={`${css.view} ${className}`}>
        {jsx}
        {sdkModalInfo.open ? <SDKModal modalInfo={sdkModalInfo}/> : null}
        {materialSelectorInfo.open ? <ComponentSelector {...materialSelectorInfo} /> : null}
      </div>
    </GlobalContext.Provider>
  )
}

function Loading() {
  return (
    <div className={css.loadingContainer}>
      <div className={css.loadingText}>
        加载中，请稍后...
      </div>
    </div>
  )
}
