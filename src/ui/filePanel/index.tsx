import React from 'react';
import ReactDOM, {unmountComponentAtNode} from "react-dom";
import FilePanel, {FilePanelProps} from './filePanel';

let root: HTMLDivElement;

export const openFilePanel = (options: FilePanelProps, container = null) => {
	return new Promise((resolve) => {
		if (container) {
			root = container;
		} else if (!root) {
			root = document.createElement('div');
			root.setAttribute('data-id', 'file-panel-root');
			document.body.appendChild(root);
		}
		
		const onClose = () => {
			unmountComponentAtNode(root);
			options.onClose?.();
			resolve(undefined);
		};
		const onOk = (file: Record<string, unknown>) => {
			unmountComponentAtNode(root);
			options.onClose?.();
			resolve(file);
		};
		
		ReactDOM.render(<FilePanel {...options} onClose={onClose} onOk={onOk} root={root} />, root);
	});
};