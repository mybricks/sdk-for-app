import { safeParse } from './parse'

export const getCookies = () => {
	return document.cookie.split('; ').reduce((s, e) => {
		const p = e.indexOf('=');
		s[e.slice(0, p)] = e.slice(p + 1);
		return s;
	}, {});
};

const cookies = getCookies();
const userBasicInfo = safeParse(cookies['mybricks-login-user'])

interface UserInfo {
	email: string
	id: string
}

export const getUserInfo = ():UserInfo => {
	return userBasicInfo || {}
}