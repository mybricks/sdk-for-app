import React, { FC, useCallback, useEffect, useRef } from 'react';
import { Modal } from 'antd';

import styles from './SDKModal.less';

interface SDKModalProps {
	modalInfo: {
		url: string;
		open: boolean;
		params: Record<string, unknown>
		onClose(): void;
		onSuccess(params: any): void;
	};
}

const MYBRICKS_MSG_CHANNEL = 'MYBRICKS_MSG_CHANNEL';
const SDKModal: FC<SDKModalProps> = props => {
	const { url, open, onClose, onSuccess, params } = props.modalInfo;
	const iframeRef = useRef<HTMLIFrameElement>(null);

	const onMessage = useCallback((event) => {
		const { key, action, payload } = event.data;
		if (key === MYBRICKS_MSG_CHANNEL) {
			if (action === 'onLoad') {
				iframeRef.current?.contentWindow?.postMessage({
					key: MYBRICKS_MSG_CHANNEL,
					action: 'initialData',
					payload: JSON.stringify(params),
				}, '*');
			} else if (action === 'closeModal') {
				onClose?.();
			} else if (action === 'onSuccess') {
				try {
					onSuccess?.(JSON.parse(payload));
				} catch (e) {
					console.log('modal onSuccess error', e);
				}
			}
		}
	}, [onClose, onSuccess, params]);

	useEffect(() => {
		window.addEventListener('message', onMessage);
		return () => {
			window.removeEventListener('message', onMessage);
		};
	}, [onMessage]);

	return (
		<Modal
			closable={false}
			className={styles.SDKModal}
			maskStyle={{ zIndex: 10000 }}
			wrapClassName='SDKModalWrap'
			centered
			open={open}
			visible={open}
			width={1200}
			destroyOnClose
			footer={null}
		>
			<iframe className={styles.iframe} ref={iframeRef} src={url} frameBorder="0"></iframe>
		</Modal>
	);
};

export default SDKModal;