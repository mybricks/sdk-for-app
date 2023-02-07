import axios from 'axios';
import {message} from 'antd';
import React, {
  useEffect,
  forwardRef,
  ForwardRefRenderFunction,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useState
} from "react"; 
import { FileContent, ViewProps, ViewRef, IInstalledApp, IConfig, API_CODE } from '../../type'
import SDKModal from '../sdkModal/SDKModal';
import API from '../../api/index'
import GlobalContext from './globalContext';
import {getUrlParam, safeParse} from '../util';

import css from './css.less'

const DefaultConfig: IConfig = {
  system: {}
}

const View = (props: any, ref) => {
  // @ts-ignore
  if(!PKG) {
    return <div>应用加载失败</div>
  }
  // @ts-ignore
  const namespace = PKG?.mybricks?.extName
  // @ts-ignore
  const extName = PKG?.name;
  const {children} = props;
  const [content, setContent] = useState<FileContent | null>(null);
  const [config, setConfig] = useState<IConfig>(DefaultConfig);
  const [installedApps, setInstalledApps] = useState([]);
  const [sdkModalInfo, setSDKModalInfo] = useState<any>({});
  const [user, setUser] = useState<any>({});
  const fileId = useMemo(() => Number(getUrlParam('id') ?? '0'), []);

  /** 获取全局设置 */
  useEffect(() => {
    if (!namespace) {
      return
    }
    axios({
      method: 'post',
      url: '/paas/api/config/get',
      data: {
        scope: [namespace, 'system']
      }
    }).then(({data: configData}) => {
      if (configData.code === API_CODE.SUCCESS) {
        const config = configData?.data;
        setConfig(typeof config === 'string' ? safeParse(config) : (config || DefaultConfig));
      } else {
        message.error(`获取全局配置项发生错误：${configData.message}`);
      }
    })
  }, [namespace])

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

  useImperativeHandle(ref, () => {
    return {
      user,
      get installedApps() {
        return installedApps;
      },
      get fileId() {
        return fileId;
      },
      get fileContent() {
        /** 防止外层对 content 进行修改 */
        return JSON.parse(JSON.stringify(content));
      },
      get config() {
        return JSON.parse(JSON.stringify(config));
      },
      save(params, config) {
        return axios({
          method: 'post',
          url: '/paas/api/workspace/saveFile',
          data: {
            userId: user.email,
            fileId,
            extName,
            ...params,
          }
        }).then(({data}) => {
          if (data.code === API_CODE.SUCCESS) {
            /** 通过_saveTime更新左上角的版本信息，只有版本信息LastUpdateInfo在消费 */
            setContent(c => ({...c, _saveTime: new Date().getTime()}))
            !config?.skipMessage && message.success(`保存完成`);
          } else {
            !config?.skipMessage && message.error(`保存失败：${data.message}`);
            return Promise.reject(data.message);
          }
        });
      },
      openUrl({
                url,
                onFailed,
                params = {},
                onSuccess
              }: { url: string, params: any, onSuccess: Function, onFailed: Function }) {
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
      },
      publish(params, config) {
        return axios({
          method: 'post',
          url: '/paas/api/workspace/publish',
          data: {
            userId: user.email,
            fileId,
            extName,
            ...params,
          }
        }).then(({data}) => {
          if (data.code === API_CODE.SUCCESS) {
            !config?.skipMessage && message.success(`发布完成`);
          } else {
            !config?.skipMessage && message.error(`发布失败：${data.message}`);
            return Promise.reject(data.message);
          }
        })
      },
    } as any
  }, [user, fileId, extName, content, config, installedApps]);


  return (
    <GlobalContext.Provider value={{fileContent: '', user: {email: ''}, fileId: 123}}>
      <div className={css.view}>
        {children}
        {sdkModalInfo.open ? <SDKModal modalInfo={sdkModalInfo}/> : null}
      </div>
    </GlobalContext.Provider>
  )
}

export default forwardRef(View)