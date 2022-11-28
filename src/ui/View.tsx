import React, { forwardRef, ForwardRefRenderFunction, useImperativeHandle, useMemo, useState } from 'react';
import axios from 'axios';
import { message } from 'antd';
import { getCookies, getUrlParam, safeParse } from '../utils';
import { FileContent, ViewProps, ViewRef } from './type';

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
	const user = useMemo(() => safeParse(cookies['mybricks-login-user']), []);
	const fileId = useMemo(() => Number(getUrlParam('id') ?? '0'), []);
	
	useMemo(() => {
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
				setConfig(typeof configData.data.config === 'string' ? safeParse(configData.data.config) : configData.data.config);
			} else {
				message.error(`获取全局配置项发生错误：${configData.message}`);
			}
		})
	}, []);
	
  useImperativeHandle(ref, () => {
    return {
	    user,
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
  }, [user, fileId, extName, content, config]);

  return (
    <div className={`${css.view} ${className}`}>
      {children}
    </div>
  )
}

export default forwardRef(View)