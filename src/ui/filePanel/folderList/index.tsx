import React, {CSSProperties, useMemo} from 'react';
// @ts-ignore
import {evt, observe} from '@mybricks/rxui';
import {LoadingOutlined, CaretRightOutlined} from '@ant-design/icons';
// @ts-ignore
import css from './index.less';

interface Props {
	appMap: Record<string, any>;
	active: any;
	dataSource: Array<any>;
	clickWrapper(item: any): void;
	clickSwitcher?(item: any): void;
	bodyStyle?: CSSProperties;
}

const FolderList = (props: Props) => {
	return (
		<div className={css.container}>
			<div className={css.content} style={props.bodyStyle}>
				{/* @ts-ignore */}
				<Tree count={0} {...props} />
			</div>
		</div>
	);
};

function Tree({ dataSource, active, clickWrapper, clickSwitcher, count, appMap = {} }: any) {
	if (!Array.isArray(dataSource)) {
		return null;
	}
	
	return dataSource
		.filter(Boolean)
		.filter(item => ['folder', 'folder-project', 'folder-module', 'my-file', 'group'].includes(item.extName))
		.map(item => {
			return (
				<Leaf
					appMap={appMap}
					key={item.id}
					active={active}
					item={item}
					clickWrapper={clickWrapper}
					clickSwitcher={clickSwitcher}
					count={count}
				/>
			);
		});
}

function Leaf({ item, clickWrapper, clickSwitcher, count, active, appMap }: any) {
	const { id, hidden, loading, open, name, extName, dataSource } = item
	
	if (hidden) {
		return null;
	}
	
	const isActive = active?.id === id;
	
	const RenderWrapper = useMemo(() => {
		return (
			<div className={`${css.tree} ${isActive ? css.active : ''}`} style={{padding: `0 0 0 ${25 * count}px`}}>
				<li onClick={evt(() => clickWrapper(item)).stop}>
					{clickSwitcher ? (
						<span className={css.switcher}>
	            {loading
		            ? <LoadingOutlined/>
		            : <CaretRightOutlined className={open ? css.open : ''} onClick={evt(() => clickSwitcher(item)).stop}/>
	            }
          </span>
					) : null}
					<span className={css.wrapper}>
            <span className={css.title}>
              <i className={`${css.iconWrapper}`}>
	              <img src={(extName && appMap?.[extName]?.icon) || appMap?.['group']?.icon} width={20} height={20}  alt="" />
              </i>
              <div className={css.unselect}>
                <span className={css.name}>
                  <span>{name}</span>
                </span>
              </div>
            </span>
          </span>
				</li>
			</div>
		)
	}, [loading, open, isActive, appMap])
	
	return (
		<div>
			{RenderWrapper}
			{dataSource?.length ? (
				<div style={{display: open ? 'block' : 'none'}}>
					{/* @ts-ignore */}
					<Tree
						appMap={appMap}
						count={count + 1}
						dataSource={dataSource}
						active={active}
						clickWrapper={clickWrapper}
						clickSwitcher={clickSwitcher}
					/>
				</div>
			) : null}
		</div>
	)
}

export default FolderList;