import moment from 'dayjs';

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

/** parse JSON string，同时 catch 错误 */
export const safeParse = (content: string) => {
	try {
		return JSON.parse(content);
	} catch(e) {
		console.log(e)
		return {};
	}
};

/**
 * 统一展示时间处理
 * @param time 时间
 * @returns    最终展示的时间格式
 */
export function unifiedTime(time) {
	if (isToday(time)) {
		return moment(time).format('HH:mm');
	} else if (isThisYear(time)) {
		return moment(time).format('M月D日 HH:mm');
	}

	return moment(time).format('YYYY年M月D日');
}

/**
 * 判断时间是否今天
 * @param time 时间
 * @returns    是否今天
 */
function isToday(time) {
	const t = moment(time).format('YYYY-MM-DD');
	const n = moment().format('YYYY-MM-DD');

	return t === n;
}

/**
 * 判断时间是否今年
 * @param time 时间
 * @returns    是否今年
 */
function isThisYear(time) {
	const t = moment(time).format('YYYY');
	const n = moment().format('YYYY');

	return t === n;
}