import HtmlWebpackPlugin from 'html-webpack-plugin';

interface AssetMapPluginOption {
	/** 文件名 */
	filename: string;
	/** 使用 chunk 名 */
	chunks: string[];
	/** 需要映射的资源 map */
	assetsMap: Array<{ tag: string; path: string; CDN: string; }>;
	/** 处理 template 字符串的方法 */
	templateContent(param: any): string;
}

const generateAssetMapPlugin = (option: AssetMapPluginOption) => {
	const { filename, chunks, assetsMap, templateContent } = option;

	return [
		new HtmlWebpackPlugin({
			filename,
			chunks,
			templateContent: (param: any) => templateContent(param)
		}),
		new HtmlWebpackPlugin({
			filename: filename.replace('.html', '.offline.html'),
			chunks,
			templateContent: (param: any) => {
				let originContent = templateContent(param);
				assetsMap.forEach(asset => {
					originContent = originContent.replace(new RegExp(`^${asset.path}$`, 'g'), asset.CDN);
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