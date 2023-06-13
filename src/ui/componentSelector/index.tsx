import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import cx from 'classnames';
import { Button, message, Modal, Spin, Tag } from 'antd';
import { uniqBy } from 'lodash';
import { ComponentSelectorProps } from './type';
import { MaterialType, SceneIdMap } from './constant';


const generateComboUrl = (components: Array<{ namespace: string; version: string }>) => {
	return document.location.origin
		+ '/api/paas/material/components/combo?components='
		+ components.reduce((pre, com, index) => {
			return pre + `${index !== 0 ? ',' : ''}${com.namespace}@${com.version}`;
		}, '');
};

// @ts-ignore
import styles from './index.less';

export const ComponentSelector: FC<ComponentSelectorProps> = props => {
	const { defaultSelected, materialType, extName, modalType, onClose, materialId, onSuccess, selectorTitle, combo, root } = props;
	const iframeRef: any = useRef<HTMLIFrameElement>();
	const [spinning, setSpinning] = useState(false);
	const sceneId = useMemo(() => {
		if (Array.isArray(extName)) {
			return extName.map(ext => SceneIdMap[ext.toLocaleLowerCase()]).join(',');
		} else {
			return SceneIdMap[extName.toLocaleLowerCase()];
		}
	}, [extName]);
	const [selectedMaterials, setSelectedMaterials] = useState([]);
	const selectedMaterialsRef = useRef([]);

	const sendSelectedMaterials = useCallback(() => {
		iframeRef.current.contentWindow?.postMessage({
			materialModalRefer: true,
			action: 'select',
			selectedMaterials: JSON.stringify(selectedMaterialsRef.current.map((com: any) => {
				return {
					materialId: com.materialId,
					namespace: com.namespace,
					version: com.version
				};
			}))
		}, '*');
	}, []);

	const addCom = useCallback((event) => {
		if (!event.data?.materialType) {
			return;
		}
		const componentLength = selectedMaterialsRef.current.filter(material => material.materialType === MaterialType.COMPONENT).length;

		if (componentLength > 4) {
			message.warning({ content: '组件选择数量不能大于 5 个', style: { marginTop: '5px', } });
			return;
		}
		const { materialId, materialType, content, title, namespace, version } = event.data;
		
		if (materialType === MaterialType.COMPONENT) {
			let materials = uniqBy([...selectedMaterialsRef.current, { materialId, materialType, content, title, namespace, version }].reverse(), 'namespace').reverse();
			selectedMaterialsRef.current = materials;
			setSelectedMaterials(materials);

			sendSelectedMaterials();
		} else if (materialType === 'init') {
			iframeRef.current.contentWindow?.postMessage({
				materialModalRefer: true,
				action: 'default',
				defaultSelected: JSON.stringify({ components: defaultSelected })
			}, '*');
		}
	}, []);

	useEffect(() => {
		window.addEventListener('message', addCom);
		return () => {
			window.removeEventListener('message', addCom);
		};
	}, []);

	const iframeUrl = useMemo(() => {
		// return `${location.origin}/page/paas/material?isSelector=true&type=${materialType}&sceneId=${sceneId}&modal=${String(modalType || '')}&materialId=${String(materialId || '')}`;
		// return 'https://fangzhou.corp.kuaishou.com/page/paas/material?isSelector=true&type=component&sceneId=2,11&modal=&materialId=',
		return 'https://eshop-fangzhou.staging.kuaishou.com/page/paas/material?isSelector=true&type=component&sceneId=2&modal=&materialId=';
	}, []);

	const onOk = useCallback(async () => {
		const params = { materials: selectedMaterials, url: undefined };
		if (combo) {
			params.url = generateComboUrl([...defaultSelected, ...selectedMaterials]);

			onSuccess(params);
			onClose?.();
		} else {
			onSuccess(params);
			onClose?.();
		}
	}, [selectedMaterials]);

	const onTagClose = useCallback(materialId => {
		selectedMaterialsRef.current = selectedMaterialsRef.current.filter(m => m.materialId !== materialId);
		setSelectedMaterials(selectedMaterialsRef.current);
		sendSelectedMaterials();
	}, []);

	const footer = useMemo(() => {
		return (
			<div className={styles.footer}>
				<div className={styles.selectedBox}>
					{selectedMaterials.length ? (
						<div>
							已选择：{selectedMaterials.map(material => {
								return <Tag closable color="volcano" key={material.materialId} onClose={() => onTagClose(material.materialId)}>{material.title}</Tag>;
							})}
						</div>
					) : '请选择需要的组件'}
				</div>
				<Button onClick={onClose}>取消</Button>
				<Button type="primary" onClick={onOk} disabled={!selectedMaterials.length}>确定</Button>
			</div>
		);
	}, [selectedMaterials]);

	return (
		<Modal
			getContainer={root}
			title={selectorTitle || '选择组件'}
			footer={footer}
			visible
			onCancel={onClose}
		  destroyOnClose
			maskClosable={true}
			closable={true}
			wrapClassName={cx(styles.materialModal, 'fangzhou-theme')}
			width="1200px"
			bodyStyle={{ padding: 0, height: '80vh', borderRadius: '4px' }}
		>
			<Spin
				className={styles.spin}
				spinning={spinning}
				tip="加载中..."
				style={{
					maxHeight: '100%',
				}}
			>
				<iframe className={styles.iframe} ref={iframeRef} src={iframeUrl} onLoad={() => setSpinning(false)} />
			</Spin>
		</Modal>
	);
};
