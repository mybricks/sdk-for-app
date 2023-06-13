/** 物料类型，组件库/组件 */
export enum MaterialType {
	/** 组件库 */
	COM_LIB = 'comlib',
	/** 组件 */
	COMPONENT = 'component',
	/** 图片 */
	PICTURE = 'picture',
	/** 模板 */
	TEMPLATE = 'template',
}

/** 搭建文件类型 */
export enum ExtNames {
	/** 中后台页面 */
	PCSPA = 'pcspa',
	/** H5页面 */
	KH5 = 'kh5',
	/** 云组件 */
	CDM = 'cdm',
	/** 卡片 */
	CARD = 'card',
	/** 模板向导 */
	TPLG = 'tplg',
	/** C 端大促 */
	PROMOTION = 'promotion',
	/** 海报 */
	POSTER = 'poster',
	/** KTaro 页面 */
	KTARO = 'ktaro',
	/** 营销活动 **/
	H5ACT = 'h5act',
	/** PC 云组件 **/
	CDM_PCSPA = 'cdm.pcspa'
}

export const SceneIdMap = {
	[ExtNames.PCSPA]: 1,
	[ExtNames.KH5]: 2,
	[ExtNames.CDM]: 1,
	[ExtNames.CARD]: 2,
	[ExtNames.TPLG]: 1,
	[ExtNames.PROMOTION]: 3,
	[ExtNames.POSTER]: 3,
	[ExtNames.KTARO]: 11,
	[ExtNames.H5ACT]: 2,
	[ExtNames.CDM_PCSPA]: 1,
};