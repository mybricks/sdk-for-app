import React, { forwardRef, ForwardRefRenderFunction, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import axios from 'axios';
import { message } from 'antd';
import { getCookies, getUrlParam, safeParse } from '../utils';
import { FileContent, ViewProps, ViewRef, IInstalledApp } from './type';

import css from './View.less'

const cookies = getCookies();
const API_SUCCESS_CODE = 1;
/**
 * 前端全局拦截，注入相关能力
 * @param props
 * @param ref
 * @constructor
 */
const View: ForwardRefRenderFunction<ViewRef, ViewProps> = (props, ref) => {
  const { children, extName, className = '' } = props;
	const [content, setContent] = useState<FileContent | null>(null);
	const [config, setConfig] = useState<Record<string, unknown>>({});
	const [installedApps, setInstalledApps] = useState([])
	const user = useMemo(() => safeParse(cookies['mybricks-login-user']), []);
	const fileId = useMemo(() => Number(getUrlParam('id') ?? '0'), []);
	
	useEffect(() => {
		axios({ method: 'get', url: '/api/apps/getInstalledList' })
		.then(({data}) => {
			if (data.code === API_SUCCESS_CODE) {
				setInstalledApps(data.data);
			} else {
				message.error(`获取应用元信息失败：${data.message}`);
			}
		})
	}, [])

	useMemo(() => {
		if (fileId) {
			Promise.all([
				axios({
					method: 'get',
					url: '/api/workspace/getFullFile',
					params: { userId: user.email, fileId }
				}),
				axios({ method: 'get', url: '/api/config/get' })
			]).then(([{ data }, { data: configData }]) => {
				if (data.code === API_SUCCESS_CODE) {
					setContent({ ...data.data, content: safeParse(data.data.content) });
				} else {
					message.error(`获取页面数据发生错误：${data.message}`);
				}
				
				if (configData.code === API_SUCCESS_CODE) {
					const config = configData.data?.config;
					setConfig(typeof config === 'string' ? safeParse(config) : (config || {}));
				} else {
					message.error(`获取全局配置项发生错误：${configData.message}`);
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
				return content;
	    },
	    get globalConfig() {
				return config;
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
			    if (data.code === API_SUCCESS_CODE) {
				    !config?.skipMessage && message.info(`保存完成`);
			    } else {
				    !config?.skipMessage && message.error(`保存失败：${data.message}`);
				    return Promise.reject(data.message);
			    }
		    });
	    },
			openUrl({url, onFailed, param = {}, onSuccess}: {url: string, param: any,onSuccess: Function, onFailed: Function}) {
				const [schema, removeSchemaPart] = url.split('://');
				const [pathPart] = removeSchemaPart?.split('?');
				const [namespace, action] = pathPart?.split('/');
				let urlSchema = ''
				installedApps?.forEach((app: IInstalledApp) => {
					if(app.namespace === namespace) {
						app?.exports?.forEach(e => {
							if(e.name === action) {
								urlSchema = `/${namespace}/${e.path}`
							}
						})
					}
				})
				if(!urlSchema) {
					onFailed({
						code: -1,
						message: `应用 ${namespace} 未对外暴露 ${action} 能力!`
					})
				} else {
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
			    if (data.code === API_SUCCESS_CODE) {
				    !config?.skipMessage && message.info(`发布完成`);
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
    </div>
  )
}

export default forwardRef(View)