/**
 * 获取url参数
 * @param key key
 * @returns   value/undefined
 */
export function getUrlParam(key: string): string | undefined {
	const searchAry: string[] = location.search.slice(1).split('&');

	for(let i = 0; i < searchAry.length; i++) {
		const kv = searchAry[i].split('=');
		if (kv[0] === key) {
			return kv[1];
		}
	}

	return;
}