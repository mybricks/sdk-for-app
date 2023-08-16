import React, {FC, useCallback, useEffect, useRef, useState} from 'react';
import {Modal} from 'antd';
import axios from 'axios';
import API from '../../api';
import FolderList from './folderList';
import CustomBreadcrumb from './breadcrumb';
import Files from './files';

// @ts-ignore
import styles from './index.less';

export interface FilePanelProps {
	fileId?: number;
	parentId?: number;
	checkModule?: boolean;
	root?: HTMLDivElement;
	allowedFileExtNames?: string[];
	onClose?(): void;
	onOk?(file: Record<string, unknown> | null): void;
}

type AppMapCacheType = { [keyName: string]: any } | null;
let AppMapCache: AppMapCacheType = null;
const MY_FILE_ROOT_ID = 0;
const BASE_APP_MAP = {};
/** 默认请求文件列表接口 */
const getFiles = async (file: any, params: Record<string, unknown>) => {
	const data = await axios({ method: 'get', url: file.isMyFile ? '/api/file/getMyFiles' : '/api/file/getGroupFiles', params })
		.then(({ data }) => {
			if (data.code === 1 && data.data) {
				return data.data;
			} else {
				return [];
			}
		});
	
	file.dataSource = data.map((item: Record<string, unknown>) => ({ ...item, isMyFile: file.isMyFile, parentIdPath: file.parentIdPath ? `${file.parentIdPath}-${file.id}` : String(file.id) }));
	file.loading = false;
	
	return file;
}
const FilePanel: FC<FilePanelProps> = props => {
	const { root, onClose, parentId, fileId, checkModule, allowedFileExtNames = [], onOk: curOnOk } = props;
	const [selectedFile, setSelectedFile] = useState<Record<string, unknown> | null>(null);
	const [dataSource, setDataSource] = useState<any[]>([]);
	const [appMap, setAppMap] = useState<AppMapCacheType>(AppMapCache);
	const [path, setPath] = useState<any[]>([]);
	const user = useRef<{ id: number }>(null);
	
	/** 请求所有已安装应用 */
	useEffect(() => {
		if (AppMapCache) {
			return;
		}
		API.App.getInstalledList().then((installedApps: any) => {
			let appMap: Record<string, any> = {};
			installedApps?.forEach((app: Record<string, string>) => {
				appMap[app.extName] = app;
			});
			
			appMap['my-file'] = { icon: 'https://assets.mybricks.world/icon/myprojects.7cd8f4c7813982aa.png' };
			appMap.folder = { icon: 'https://assets.mybricks.world/icon/folder.5782d987cf098ea8.png' };
			appMap.group = { icon: 'https://f2.beckwai.com/udata/pkg/eshop/chrome-plugin-upload/2023-04-10/1681111987218.2b93521b316afc3d.svg' };
			appMap['folder-project'] = { icon: 'https://f2.beckwai.com/udata/pkg/eshop/chrome-plugin-upload/2023-04-10/1681112076738.8d9d9e500c844d70.svg' };
			appMap['folder-module'] = { icon: 'https://f2.beckwai.com/udata/pkg/eshop/chrome-plugin-upload/2023-04-10/1681112147704.8ba05cbe3f79fbb8.svg' };
			
			AppMapCache = JSON.parse(JSON.stringify(appMap));
			
			setAppMap(appMap)
		});
	}, []);
	
	useEffect(() => {
		;(async () => {
			const curUser: { id: number; } = await API.User.getLoginUser()
			// @ts-ignore
			user.current = curUser;
			
			let rootFile = null;
			if (fileId) {
				rootFile = await API.File.getFileRoot({ creatorId: curUser?.id, parentId, fileId, checkModule });
				rootFile.extName === 'my-file' && (rootFile.open = true);
				
				setDataSource(rootFile ? [rootFile] : []);
				setPath(rootFile ? [rootFile] : []);
			} else {
				Promise.all([
					await axios({ method: 'get', url: '/paas/api/userGroup/getVisibleGroups', params: { userId: curUser.id } }),
					axios({ method: 'get', url: '/api/file/getMyFiles', params: { userId: curUser.id }})
				])
					.then(([{ data: { data: groupData, code: groupCode } }, { data: { data: myFileData, code: myFileCode } }]) => {
						let dataSource: any[] = [{
							id: MY_FILE_ROOT_ID,
							name: "我的",
							extName: "my-file",
							isMyFile: true,
						}];
						if (myFileCode === 1 && Array.isArray(myFileData)) {
							dataSource[0].dataSource = myFileData.map((item: any) => ({ ...item, parentIdPath: String(MY_FILE_ROOT_ID) }));
						}
						if (groupCode === 1 && Array.isArray(groupData)) {
							dataSource.push(
								...groupData
									?.filter((item: any) => item.roleDescription && item.roleDescription < 3)
									.map((item: any) => ({ ...item, extName: 'group' }))
							);
						}
						
						setPath([dataSource[0]]);
						setDataSource(dataSource);
					});
				
				return;
			}
			
			if (!rootFile || rootFile.extName === 'my-file') {
				return;
			}
			
			const file = await getFiles(rootFile, {
				userId: curUser?.id,
				groupId: rootFile.extName === 'group'? rootFile.id : rootFile.groupId,
				parentId: rootFile.extName === 'group'? undefined : rootFile.id,
			});
			
			file.open = true;
			setPath([file]);
			setDataSource([file]);
		})();
	}, []);
	
	const onOk = useCallback(() => {
		curOnOk?.(selectedFile);
	}, [selectedFile, curOnOk]);
	const getParams = useCallback((item: any) => {
		let params: Record<string, unknown> = {
			userId: user.current?.id,
		};
		if (item.isMyFile) {
			params.parentId = item.id !== MY_FILE_ROOT_ID ? item.id : undefined;
		} else {
			if (!item.groupId) {
				// 协作组
				params.groupId = item.id
			} else {
				params.groupId = item.groupId
				params.parentId = item.id
			}
		}
		
		return params;
	}, []);
	
	const handlePath = useCallback((item: any) => {
		setSelectedFile(null);
		if (!item.parentIdPath) {
			setPath([item]);
		} else {
			let parentIds = item.parentIdPath.split('-').map(Number);
			let parent: any = { dataSource };
			const curPath: any[] = [];
			
			while (parentIds.length) {
				let parentId = parentIds.shift();
				parent = parent.dataSource.find((item: any) => item.id === parentId);
				
				if (parent) {
					curPath.push(parent);
				} else {
					return;
				}
			}
			
			setPath([...curPath, item]);
		}
	}, [dataSource]);
	
	const clickWrapper = useCallback((item: any) => {
		handlePath(item);
		
		if (Array.isArray(item.dataSource)) {
			if (!item.open) {
				item.open = true;
				setDataSource([...dataSource]);
			}
			return;
		}
		
		item.loading = true;
		setDataSource([...dataSource]);
		
		getFiles(item, getParams(item)).then(() => {
			!item.open && (item.open = true);
			
			setDataSource([...dataSource]);
		});
	}, [dataSource, handlePath, getParams]);
	
	const clickFile = useCallback((item: any) => {
		if (allowedFileExtNames.includes(item.extName)) {
			setSelectedFile(pre => item.id === pre?.id ? null : item);
		}
	}, [allowedFileExtNames]);
	
	const doubleClickFile = useCallback((item: any) => {
		if (!['folder', 'folder-project', 'folder-module', 'my-file', 'group'].includes(item.extName)) {
			
			if (allowedFileExtNames.includes(item.extName)) {
				curOnOk?.(item);
			}
			
			return;
		}
		
		handlePath(item);
		
		if (Array.isArray(item.dataSource)) {
			return;
		}
		
		getFiles(item, getParams(item)).then(() => setDataSource([...dataSource]));
	}, [dataSource, handlePath, getParams, allowedFileExtNames, curOnOk]);
	
	const clickSwitcher = useCallback((item: any) => {
		if (Array.isArray(item.dataSource)) {
			item.open = !item.open;
			setDataSource([...dataSource]);
			return;
		}
		
		item.loading = true;
		setDataSource([...dataSource]);
		
		getFiles(item, getParams(item)).then(() => {
			item.open = true;
			setDataSource([...dataSource]);
		});
	}, [dataSource, getParams]);
	
	return (
		// @ts-ignore
		<Modal
		  visible
		  getContainer={root}
		  width={962}
		  wrapClassName="fangzhou-theme"
		  className={styles.filePanelModal}
		  title="文件选择"
		  onCancel={onClose}
		  maskClosable
		  closable
		  cancelText="取消"
		  okText="选择"
		  okButtonProps={{ disabled: !selectedFile }}
		  onOk={onOk}
	  >
			<div className={styles.filePanel}>
				<FolderList
					appMap={appMap || BASE_APP_MAP}
					active={path[path.length - 1]}
					bodyStyle={{marginLeft: 0}}
					dataSource={dataSource}
					clickWrapper={clickWrapper}
					clickSwitcher={clickSwitcher}
				/>
				<div className={styles.contentSide}>
					<CustomBreadcrumb appMap={appMap || BASE_APP_MAP} path={path} handlePath={handlePath} />
					{path[path.length - 1] ? (
						<Files
							file={path[path.length - 1]}
							appMap={appMap || BASE_APP_MAP}
							allowedFileExtNames={allowedFileExtNames}
							clickFile={clickFile}
							doubleClickFile={doubleClickFile}
							selectedFile={selectedFile}
						/>
					) : null}
				</div>
			</div>
		</Modal>
  );
};

export default FilePanel;