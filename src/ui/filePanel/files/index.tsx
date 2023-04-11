import React, {FC, useMemo} from 'react';

import styles from './index.less';

interface FilesProps {
	file: any;
	appMap: any;
	selectedFile: Record<string, unknown> | null;
	allowedFileExtNames: string[];
	clickFile(item: any): void;
	doubleClickFile(item: any): void;
}

const File: FC<FilesProps> = props => {
	const { file, allowedFileExtNames, appMap, clickFile, selectedFile, doubleClickFile } = props;
	const iconSrc = appMap?.[file.extName]?.icon;
	const isAllowed = allowedFileExtNames.includes(file.extName);
	const selected = selectedFile?.id === file.id;
	
	return (
		<div
			className={`${styles.file} ${isAllowed ? '' : styles.noAllow} ${selected ? styles.selected : ''}`}
			onClick={isAllowed ? () => clickFile(file) : undefined}
			onDoubleClick={isAllowed ? () => doubleClickFile(file) : undefined}
		>
			<div className={styles.icon}>
				<img src={iconSrc} width={50} height={50}  alt="" />
			</div>
			<div className={styles.name}>{file.name}</div>
		</div>
	);
}

const Files: FC<FilesProps> = props => {
	const { file, allowedFileExtNames, appMap, clickFile, selectedFile, doubleClickFile } = props;
	
	const children = useMemo(() => {
		const extNames = Object.keys(appMap);
		const dataSource = file.dataSource?.filter((item: any) => extNames.includes(item.extName)) ?? [];
		
		if (file.loading) {
			return <div className={styles.loading}>加载中，请稍后...</div>;
		} else if (!dataSource?.length) {
			return  <div className={styles.loading}>暂无内容</div>;
		}
		
		return dataSource.map((item: any) => {
			return (
				<File
					selectedFile={selectedFile}
					clickFile={clickFile}
					doubleClickFile={doubleClickFile}
					key={item.id}
					file={item}
					appMap={appMap}
					allowedFileExtNames={Array.from(new Set([...allowedFileExtNames, 'folder', 'folder-project', 'folder-module', 'my-file', 'group']))}
				/>
			);
		});
	}, [file.loading, file.dataSource, appMap, allowedFileExtNames, clickFile, selectedFile]);
	
  return (
	  <div className={styles.fileContainer}>
		  {children}
	  </div>
  );
};

export default Files;