import React, { FC } from 'react';
import {Breadcrumb} from 'antd';

import styles from './index.less';

interface CustomBreadcrumbProps {
	path: any[];
	appMap: Record<string, any>;
	handlePath(item: any): void;
}

const CustomBreadcrumb: FC<CustomBreadcrumbProps> = props => {
	const { path, handlePath, appMap } = props;
	const pathLastIndex = path.length - 1;
	
  return (
	  <div className={styles.titleBar}>
		  <Breadcrumb separator='>' className={styles.breadcrumb}>
			  {path.map((item: any, idx: number) => {
				  const { id, name } = item;
					
				  let icon = null;
				  if (['folder-project', 'folder-module'].includes(item.extName)) {
					  let iconSrc = appMap?.[item.extName]?.icon;
					  icon = iconSrc ? <img src={iconSrc} style={{ marginRight: '4px' }} width={20} height={20} alt="" /> : null;
				  }
				  
				  return (
					  <Breadcrumb.Item
						  key={id}
						  // @ts-ignore
						  style={{ cursor: pathLastIndex !== idx ? 'pointer' : 'default' }}
						  onClick={() => pathLastIndex !== idx && handlePath(item)}
					  >
						  <div className={styles.breadcrumbContent}>
							  {icon}
							  <span>{name}</span>
						  </div>
					  </Breadcrumb.Item>
				  );
			  })}
		  </Breadcrumb>
	  </div>
  );
};

export default CustomBreadcrumb;