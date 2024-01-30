import HtmlWebpackPlugin from 'html-webpack-plugin';
import { INLINE_ASSETS } from './constant';
const fs = require('fs');

interface AssetMapPluginOption {
	/** 文件名 */
	filename: string;
	/** 使用 chunk 名 */
	chunks: string[];
	template?: string;
	/** 需要映射的资源 map */
	assetsMap: Array<{ tag: string; path: string; CDN: string; }>;
	/** 处理 template 字符串的方法 */
	templateContent(param: any): string;
}

const generateAssetMapPlugin = (option: AssetMapPluginOption) => {
	const { filename, chunks, assetsMap = [], template, templateContent } = option;

	return [
		new HtmlWebpackPlugin({
			filename: filename.replace('.html', '.offline.html'),
			chunks,
			templateContent: (param: any) => {
				return templateContent ? templateContent(param) : (template ? fs.readFileSync(template, 'utf-8') : '');
			}
		}),
		new HtmlWebpackPlugin({
			filename,
			chunks,
			templateContent: (param: any) => {
				let originContent = templateContent ? templateContent(param) : (template ? fs.readFileSync(template, 'utf-8') : '');
				[...assetsMap, ...INLINE_ASSETS].forEach(asset => {
					originContent = originContent.replace(new RegExp(`(?<=")${asset.path}(?=")`, 'g'), asset.CDN);
				});

				return originContent;
			}
		})
	];
};

const Plugins = {
	generateAssetMapPlugin
};

export default Plugins;