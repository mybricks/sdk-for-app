import React, { forwardRef, ForwardRefRenderFunction, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import axios from 'axios';
import { message } from 'antd';
import { getCookies, getUrlParam, safeParse } from '../utils';
import { FileContent, ViewProps, ViewRef, IInstalledApp, IConfig, API_CODE } from './type';
import SDKModal from './SDKModal';

import css from './View.less'

const cookies = getCookies();
const DefaultConfig: IConfig = {
	system: {}
}
/**
 * 前端全局拦截，注入相关能力
 * @param props
 * @param ref
 * @constructor
 */
const View: ForwardRefRenderFunction<ViewRef, ViewProps> = (props, ref) => {
  const { children, extName, className = '', namespace } = props;
	const [content, setContent] = useState<FileContent | null>(null);
	const [config, setConfig] = useState<IConfig>(DefaultConfig);
	const [installedApps, setInstalledApps] = useState([]);
	const [sdkModalInfo, setSDKModalInfo] = useState<any>({});
	const [user, setUser] = useState(safeParse(cookies['mybricks-login-user']));
	const fileId = useMemo(() => Number(getUrlParam('id') ?? '0'), []);
	
	/** 获取已安装APP */
	useEffect(() => {
		axios({ method: 'get', url: '/api/apps/getInstalledList' })
		.then(({data}) => {
			if (data.code === API_CODE.SUCCESS) {
				setInstalledApps(data.data);
			} else {
				message.error(`获取应用元信息失败：${data.message}`);
			}
		});
		
		axios({ method: 'get', url: `/api/user/queryBy?email=${user.email}` }).then(({ data }) => {
			if (data?.code === API_CODE.SUCCESS) {
				setUser(user => ({ ...user, isAdmin: data?.data?.[0]?.role === 10 }));
			}
		});
	}, [])

	/** 获取全局设置 */
	useEffect(() => {
		if (!namespace) {
			return
		}

		axios({ 
			method: 'post', 
			url: '/api/config/get',
			data: {
				scope: [namespace, 'system']
			}
		}).then(({ data: configData }) => {
			if (configData.code === API_CODE.SUCCESS) {
				const config = configData?.data;
				setConfig(typeof config === 'string' ? safeParse(config) : (config || DefaultConfig));
			} else {
				message.error(`获取全局配置项发生错误：${configData.message}`);
			}
		})
	}, [namespace])

	useMemo(() => {
		if (fileId) {
			Promise.all([
				axios({
					method: 'get',
					url: '/api/workspace/getFullFile',
					params: { userId: user.email, fileId }
				}),
			]).then(([{ data }]) => {
				if (data.code === API_CODE.SUCCESS) {
					setContent({ ...data.data, content: safeParse(data.data.content) });
				} else {
					message.error(`获取页面数据发生错误：${data.message}`);
				}
			})
		}
	}, [fileId]);
	
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
			    url: '/api/workspace/saveFile',
			    data: {
				    userId: user.email,
				    fileId,
				    extName,
				    ...params,
			    }
		    }).then(({ data }) => {
			    if (data.code === API_CODE.SUCCESS) {
				    !config?.skipMessage && message.success(`保存完成`);
			    } else {
				    !config?.skipMessage && message.error(`保存失败：${data.message}`);
				    return Promise.reject(data.message);
			    }
		    });
	    },
			openUrl({url, onFailed, params = {}, onSuccess}: {url: string, params: any,onSuccess: Function, onFailed: Function}) {
				const [schema, removeSchemaPart] = url.split('://');
				const [pathPart] = removeSchemaPart?.split('?');
				const [namespace, action] = pathPart?.split('/');
				let urlSchema = '';
				installedApps?.forEach((app: IInstalledApp) => {
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
					setSDKModalInfo({
						open: true,
						params,
						url: urlSchema,
						onSuccess,
						onFailed,
						onClose: () => setSDKModalInfo({ open: false }),
					});
					/** js 组件类型
						axios.get(urlSchema).then((res) => {
							try {
								eval(res.data)
								// ts-ignore
								let fn;
								if(window?.[action]?.default) {
									fn = window?.[action]?.default
								} else {
									fn = window?.[action]
								}
								fn({
									...param,
									onSuccess,
									onFailed
								})
							} catch(e) {
								console.log(e)
							}
						})
					*/
				}
			},
	    publish(params, config) {
		    return axios({
			    method: 'post',
			    url: '/api/workspace/publish',
			    data: {
				    userId: user.email,
				    fileId,
				    extName,
				    ...params,
			    }
		    }).then(({ data }) => {
			    if (data.code === API_CODE.SUCCESS) {
				    !config?.skipMessage && message.success(`发布完成`);
			    } else {
				    !config?.skipMessage && message.error(`发布失败：${data.message}`);
						return Promise.reject(data.message);
			    }
		    })
	    },
    };
  }, [user, fileId, extName, content, config, installedApps]);

  return (
    <div className={`${css.view} ${className}`}>
      {children}
	    {sdkModalInfo.open ? <SDKModal modalInfo={sdkModalInfo}/> : null}
    </div>
  )
}

export default forwardRef(View)