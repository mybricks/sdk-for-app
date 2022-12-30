import React, { forwardRef, ForwardRefRenderFunction, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import axios from 'axios';
import { message } from 'antd';
import { getCookies, getUrlParam, safeParse } from '../utils';
import { FileContent, ViewProps, ViewRef, IInstalledApp, IConfig, API_CODE } from './type';
import SDKModal from './SDKModal';
import GlobalContext from './globalContext';
import css from './View.less'

const BASIC_DATA = {
  installedApps: [],
  user: {
    email: 'admin@admin.com',
    isAdmin: false,
  },
  config: {
    system: {}
  }
}
// @ts-ignore
const GLOBAL_MOCK_DATA = MOCKDATA ? Object.assign({}, BASIC_DATA, MOCKDATA) : BASIC_DATA

const MockView: ForwardRefRenderFunction<ViewRef, ViewProps> = (props, ref) => {
  const { children, extName, className = '', namespace } = props;
	const [content, setContent] = useState<any>(null);
	const [sdkModalInfo, setSDKModalInfo] = useState<any>({});
	const fileId = useMemo(() => Number(getUrlParam('id') ?? '0'), []);

	useMemo(() => {
		if (fileId) {
      let str = localStorage.getItem(`MYBRICKS_MOCK_FILE:${fileId}`)
      if(str) {
        const obj = JSON.parse(str)
        setContent({
          ...obj,
          content: safeParse(obj.content)
        })
      } else {
        setContent({
          content: {},
          creatorId: GLOBAL_MOCK_DATA.user.email
        })
      }
		}
	}, [fileId]);
	
  useImperativeHandle(ref, () => {
    return {
	    user: GLOBAL_MOCK_DATA.user,
			get installedApps() {
				return GLOBAL_MOCK_DATA.installedApps;
			},
	    get fileId() {
		    return fileId;
	    },
	    get fileContent() {
				/** 防止外层对 content 进行修改 */
				return JSON.parse(JSON.stringify(content));
	    },
	    get config() {
				return GLOBAL_MOCK_DATA.config
	    },
	    save(params, config) {
        const { content, fileId } = params;
        if(content) {
          localStorage.setItem(`MYBRICKS_MOCK_FILE:${fileId}`, JSON.stringify({
            content: content,
            creatorId: GLOBAL_MOCK_DATA.user.email
          }))
        }
	    },
			openUrl({url, onFailed, params = {}, onSuccess}: {url: string, params: any,onSuccess: Function, onFailed: Function}) {
				const [schema, removeSchemaPart] = url.split('://');
				const [pathPart] = removeSchemaPart?.split('?');
				const [namespace, action] = pathPart?.split('/');
				let urlSchema = '';
				GLOBAL_MOCK_DATA?.installedApps?.forEach((app: IInstalledApp) => {
					if(app.namespace === namespace) {
						app?.exports?.forEach(e => {
							if(e.name === action) {
								urlSchema = e.path;
							}
						})
					}
				});
				
				if(!urlSchema) {
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
							onClose: () => setSDKModalInfo({ open: false }),
						});
					} else if (urlSchema.endsWith('js')) {
						axios.get(urlSchema).then((res) => {
							try {
								eval(res.data);
								let fn;
								if(window?.[action]?.default) {
									fn = window?.[action]?.default;
								} else {
									fn = window?.[action];
								}
								fn({ ...params, onSuccess, onFailed });
							} catch(e) {
								console.log(e);
							}
						})
					} else {
						console.log('invalid url schema');
					}
				}
			},
	    publish(params, config) {
        message.info('发布暂未mock')
        return {
          code: -1,
          msg: '发布暂未mock'
        }
	    },
    };
  }, [fileId, extName, content]);
  return (
		<GlobalContext.Provider value={{ fileContent: content }}>
			<div className={`${css.view} ${className}`}>
				{children}
				{sdkModalInfo.open ? <SDKModal modalInfo={sdkModalInfo}/> : null}
			</div>
		</GlobalContext.Provider>
  )
}

export default MockView