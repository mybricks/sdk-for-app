import { MaterialType } from './constant';

export interface CommonParams<T> {
	defaultSelected: Array<{ materialId: number; namespace: string; version: string }>;
	/** 物料弹框类型 */
	materialType: MaterialType;
	/** 应用 ExtName，适配 sceneId */
	extName: string | string[];
	/** 初始化显示物料详情的物料类型 */
	modalType?: Omit<MaterialType, 'template'>;
	/** 默认物料 ID，用于初始化显示物料详情 */
	materialId?: number;
	/** 弹框标题 */
	selectorTitle?: string;
	/** 弹框外层容器节点 */
	root?: HTMLDivElement;
	/** 是否需要聚合成组件库，在组件选择时需要 */
	combo?: boolean;
	/** 关闭弹框 */
	onClose?(): void;
	/** 成功回调 */
	onSuccess(params: { materials: T[]; url?: string }): void;
}

export type ComponentSelectorProps = CommonParams<{
	materialId: number;
	materialType: MaterialType;
	content: string;
	title: string;
	namespace: string;
	version: string;
}>;